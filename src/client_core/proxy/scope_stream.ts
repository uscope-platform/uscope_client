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

// Layout of the frames pushed by the driver scope server (see scope_frame.hpp), little endian:
// sequence u64, timestamp_ns u64, n_channels u32, n_samples u32, followed by n_channels*n_samples float32,
// grouped by channel and already scaled by the driver
const HEADER_SIZE = 24;
const RECONNECT_DELAY_MIN_MS = 1000;
const RECONNECT_DELAY_MAX_MS = 15000;
const DEFAULT_SCOPE_PORT = "8990";

let socket: WebSocket | null = null;
let reconnect_timer: ReturnType<typeof setTimeout> | undefined;
let latest_frame: ArrayBuffer | null = null;
let connecting = false;
let disposed = false;
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
    };
    ws.onmessage = (event) => {
        // only the newest frame is of interest, older ones are simply overwritten
        if (event.data instanceof ArrayBuffer) latest_frame = event.data;
    };
    ws.onclose = () => {
        if (socket === ws) socket = null;
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
    // the payload is not guaranteed to be aligned for a Float32Array view, and has to be little endian anyway
    const values = new Float32Array(frame.slice(HEADER_SIZE, HEADER_SIZE + 4 * n_channels * n_samples));

    return Array.from({length: n_channels}, (_, channel) => ({
        channel,
        data: Array.from(values.subarray(channel * n_samples, (channel + 1) * n_samples))
    }));
};

/// Newest scope data received from the data plane, empty until the first frame arrives
export const latest_scope_data = (): scope_data_object[] => {
    // while a reconnection is scheduled the retries are left to the timer
    if (socket === null && !connecting && reconnect_timer === undefined) void connect();
    return latest_frame === null ? [] : decode_frame(latest_frame);
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
