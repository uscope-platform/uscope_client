// Copyright 2021 Filippo Savi
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

import type {register_write} from "#interfaces/index.js";
import {download_csv} from "./downloads.js";

/// The AXI tracing logs every register write accepted by the server, in the order they were sent, until it is cleared.
/// It is chosen every time the application is selected, and is off until then.

interface axi_trace_entry {
    time: number,
    write: register_write
}

let tracing = false;
let entries: axi_trace_entry[] = [];

export const is_axi_tracing = (): boolean => tracing;

export const set_axi_tracing = (enabled: boolean) => {
    tracing = enabled;
    // a trace spanning two applications would be meaningless
    entries = [];
}

export const record_axi_writes = (writes: register_write[]) => {
    if(!tracing) return;
    const time = Date.now();
    for(const write of writes) entries.push({time, write: {...write}});
}

export const axi_trace_length = (): number => entries.length;

export const clear_axi_trace = () => {
    entries = [];
}

// the addresses are 64 bits, the data is the 32 bits of a register
const hex_address = (address: number) => "0x" + BigInt(Math.trunc(address)).toString(16).toUpperCase().padStart(16, "0");
const hex_data = (value: number) => "0x" + (value >>> 0).toString(16).toUpperCase().padStart(8, "0");

export const axi_trace_csv = (): string => {
    let csv = "timestamp,address,data,type,proxy_type,proxy_address\n";
    for(const {time, write} of entries){
        csv += [
            new Date(time).toISOString(),
            hex_address(write.address),
            hex_data(write.value),
            write.type,
            write.proxy_type,
            write.type === "proxied" ? hex_address(write.proxy_address) : ""
        ].join(",") + "\n";
    }
    return csv;
}

export const download_axi_trace = () => {
    download_csv(axi_trace_csv(), "axi_trace_" + new Date().toISOString().replace(/[:.]/g, "-") + ".csv");
}
