// Copyright 2026 Filippo Savi
// Author: Filippo Savi <filssavi@gmail.com>
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import {backend_post, get_address} from "./backend.js";
import {api_dictionary} from "./api_dictionary.js";
import type {scope_data_object} from "#interfaces/index.js";

// The scope websocket of the driver carries both the data (binary messages) and the scope commands: the commands
// are text messages {id, cmd, args} answered by {id, ok, data | error}.
//
// Layout of the data frames pushed by the driver scope server (see scope_frame.hpp), little endian:
// sequence u64, timestamp_ns u64, n_channels u32, n_samples u32, followed by n_channels*n_samples float32,
// grouped by channel and already scaled by the driver
const HEADER_SIZE = 24;
const RECONNECT_DELAY_MIN_MS = 1000;
const RECONNECT_DELAY_MAX_MS = 15000;
const DEFAULT_SCOPE_PORT = "8990";
const COMMAND_TIMEOUT_MS = 10000;

let socket: WebSocket | null = null;
let reconnect_timer: ReturnType<typeof setTimeout> | undefined;
let latest_frame: ArrayBuffer | null = null;
let decoded_frame: {frame: ArrayBuffer, data: scope_data_object[]} | null = null;
const frame_listeners = new Set<() => void>();
let connecting = false;
let disposed = false;
let next_command_id = 0;

interface pending_command {
    resolve: (data: any) => void;
    reject: (reason: Error) => void;
}
const pending_commands = new Map<number, pending_command>();
const open_waiters: Array<() => void> = [];
let reconnect_delay = RECONNECT_DELAY_MIN_MS;

/// Behind a reverse proxy the data plane is published on a path of the same origin (VITE_APP_SCOPE_URL, absolute
/// or relative to the page, e.g. /uscope-scope/), otherwise it is reached directly on its own port of the control
/// plane host
const scope_url = () => {
    const configured = import.meta.env.VITE_APP_SCOPE_URL;
    let url: URL;
    if (configured) {
        url = new URL(configured, window.location.href);
    } else {
        url = new URL(get_address(), window.location.href);
        // 0.0.0.0 is a bind address, browsers can not connect to it
        if (url.hostname === "0.0.0.0") url.hostname = window.location.hostname;
        url.port = import.meta.env.VITE_APP_SCOPE_PORT ?? DEFAULT_SCOPE_PORT;
        url.pathname = "/";
    }
    url.protocol = url.protocol === "https:" || url.protocol === "wss:" ? "wss:" : "ws:";
    return url.toString();
};

const handle_reply = (message: string) => {
    let reply: {id?: number, ok?: boolean, data?: any, error?: string};
    try {
        reply = JSON.parse(message);
    } catch (e) {
        return;
    }
    if (reply.id === undefined) return;
    const command = pending_commands.get(reply.id);
    if (command === undefined) return;
    pending_commands.delete(reply.id);
    if (reply.ok) command.resolve(reply.data);
    else command.reject(new Error(reply.error ?? "Scope command failed"));
};

const schedule_reconnect = () => {
    reconnect_timer = setTimeout(connect, reconnect_delay);
    reconnect_delay = Math.min(reconnect_delay * 2, RECONNECT_DELAY_MAX_MS);
};

/// The driver only accepts the connections presenting a one time ticket, which is issued by the (authenticated)
/// control plane, so a new one is requested for every connection
const connect = async () => {
    reconnect_timer = undefined;
    if (socket !== null || connecting) return;

    connecting = true;
    let ticket: string;
    try {
        ticket = (await backend_post<{ticket: string}>(api_dictionary.operations.scope_ticket, {})).ticket;
    } catch (e) {
        connecting = false;
        if (!disposed) schedule_reconnect();
        return;
    }
    connecting = false;
    if (disposed) return;

    const ws = new WebSocket(`${scope_url()}?ticket=${ticket}`);
    ws.binaryType = "arraybuffer";
    ws.onopen = () => {
        reconnect_delay = RECONNECT_DELAY_MIN_MS;
        open_waiters.splice(0).forEach(notify => notify());
    };
    ws.onmessage = (event) => {
        if (typeof event.data === "string") {
            handle_reply(event.data);
        } else if (event.data instanceof ArrayBuffer) {
            // only the newest frame is of interest, older ones are simply overwritten
            latest_frame = event.data;
            frame_listeners.forEach(listener => listener());
        }
    };
    ws.onclose = () => {
        if (socket === ws) socket = null;
        // the replies of the commands in flight can not arrive anymore
        pending_commands.forEach(command => command.reject(new Error("The scope connection was lost")));
        pending_commands.clear();
        if (!disposed) schedule_reconnect();
    };
    ws.onerror = () => ws.close();
    socket = ws;
};

const decode_frame = (frame: ArrayBuffer): scope_data_object[] => {
    // the driver sends the samples already scaled, grouped by channel
    const view = new DataView(frame);
    const n_channels = view.getUint32(16, true);
    const n_samples = view.getUint32(20, true);
    // zero copy views on the received frame: the header is a multiple of 4 bytes and a websocket message always
    // starts at offset 0 of its own buffer, so the payload is aligned. The platforms running a browser are all little
    // endian, as the driver. The buffer is never written after reception, so a view stays valid when newer frames arrive
    const values = new Float32Array(frame, HEADER_SIZE, n_channels * n_samples);

    return Array.from({length: n_channels}, (_, channel) => ({
        channel,
        data: values.subarray(channel * n_samples, (channel + 1) * n_samples)
    }));
};

/// Resolves with the open socket, connecting (and waiting for the connection) if necessary
const open_socket = (): Promise<WebSocket> => {
    if (socket !== null && socket.readyState === WebSocket.OPEN) return Promise.resolve(socket);

    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
            open_waiters.splice(open_waiters.indexOf(notify), 1);
            reject(new Error("Unable to connect to the scope"));
        }, COMMAND_TIMEOUT_MS);
        const notify = () => {
            clearTimeout(timer);
            resolve(socket!);
        };
        open_waiters.push(notify);

        // do not wait for the next scheduled retry
        if (socket === null && !connecting) {
            clearTimeout(reconnect_timer);
            void connect();
        }
    });
};

/// Executes a scope command on the driver, sharing the connection of the data stream
export const scope_command = async <T = any>(cmd: string, args: unknown = {}): Promise<T> => {
    const ws = await open_socket();
    return new Promise<T>((resolve, reject) => {
        const id = ++next_command_id;
        const timer = setTimeout(() => {
            pending_commands.delete(id);
            reject(new Error(`Scope command ${cmd} timed out`));
        }, COMMAND_TIMEOUT_MS);
        pending_commands.set(id, {
            resolve: (data) => { clearTimeout(timer); resolve(data); },
            reject: (reason) => { clearTimeout(timer); reject(reason); }
        });
        ws.send(JSON.stringify({id, cmd, args}));
    });
};

/// Newest scope data received from the data plane, empty until the first frame arrives. The decoding is done once
/// per frame, whoever asks for it
export const latest_scope_data = (): scope_data_object[] => {
    // while a reconnection is scheduled the retries are left to the timer
    if (socket === null && !connecting && reconnect_timer === undefined) void connect();
    if (latest_frame === null) return [];
    if (decoded_frame === null || decoded_frame.frame !== latest_frame) {
        decoded_frame = {frame: latest_frame, data: decode_frame(latest_frame)};
    }
    return decoded_frame.data;
};

/// Calls the listener whenever a new data frame is received, returns the function removing the subscription.
/// Also makes sure the connection is being established
export const subscribe_scope_frames = (listener: () => void): (() => void) => {
    frame_listeners.add(listener);
    if (socket === null && !connecting && reconnect_timer === undefined) void connect();
    return () => { frame_listeners.delete(listener); };
};

// a hot reload replaces the module but would leave the old socket and its reconnect timer running
if (import.meta.hot) {
    import.meta.hot.dispose(() => {
        disposed = true;
        clearTimeout(reconnect_timer);
        reconnect_timer = undefined;
        const ws = socket;
        socket = null;
        ws?.close();
    });
}
