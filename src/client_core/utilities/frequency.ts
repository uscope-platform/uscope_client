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

const UNITS: [number, string][] = [
    [1e9, "GHz"],
    [1e6, "MHz"],
    [1e3, "kHz"],
    [1, "Hz"],
];

/// Formats a frequency in Hz with the largest unit that keeps it >= 1 (e.g. 99999001 -> "99.999001 MHz"),
/// keeping up to Hz resolution so that the exact rate is still visible
export function format_frequency(hz: number): string {
    if(!Number.isFinite(hz)) return "";
    let [scale, unit] = UNITS.find(([s]) => Math.abs(hz) >= s) ?? [1, "Hz"];
    let digits = Math.round(Math.log10(scale));
    let value = (hz / scale).toFixed(digits);
    if(value.includes(".")) value = value.replace(/\.?0+$/, "");
    return value + " " + unit;
}

/// Parses a frequency written with an optional unit ("100 MHz", "250k", "1.5e3 kHz", "50000000"); a bare number is in Hz.
/// The unit is case insensitive ("m" is mega, as a millihertz clock makes no sense). Returns the frequency in Hz, or null when it is not valid
export function parse_frequency(text: string): number | null {
    let match = text.trim().match(/^([0-9]*\.?[0-9]+(?:e[+-]?[0-9]+)?)\s*([gmk]?)(?:hz)?$/i);
    if(!match) return null;
    let value = parseFloat(match[1]!);
    let scale = {"": 1, "k": 1e3, "m": 1e6, "g": 1e9}[match[2]!.toLowerCase()]!;
    let hz = Math.round(value * scale);
    return Number.isFinite(hz) ? hz : null;
}
