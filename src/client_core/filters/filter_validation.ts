// Copyright 2023 Filippo Savi
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

/// The edges of the bands of each type of filter, from the lowest frequency to the highest one
const BAND_ORDER: Record<string, string[]> = {
    lp: ["pass_band_edge_1", "stop_band_edge_1"],
    hp: ["stop_band_edge_1", "pass_band_edge_1"],
    bp: ["stop_band_edge_1", "pass_band_edge_1", "pass_band_edge_2", "stop_band_edge_2"],
    bs: ["pass_band_edge_1", "stop_band_edge_1", "stop_band_edge_2", "pass_band_edge_2"],
};

// the widths, in bits, that the taps of an implemented filter can have
const MIN_TAPS_WIDTH = 8;
const MAX_TAPS_WIDTH = 32;

const is_number = (value: unknown): value is number => typeof value === "number" && Number.isFinite(value);

/// What is implausible in the parameters of a filter: the message of each field that is, by the name of the field.
/// An empty result is a filter that can be designed.
export const filter_validate = (parameters: Record<string, any>): Record<string, string> => {
    const errors: Record<string, string> = {};
    const fs = parameters.sampling_frequency;

    if(!is_number(fs) || fs <= 0){
        errors.sampling_frequency = "The sampling frequency has to be a number above 0";
    }
    if(!is_number(parameters.n_taps) || !Number.isInteger(parameters.n_taps) || parameters.n_taps < 1){
        errors.n_taps = "The number of taps has to be a whole number, 1 or more";
    }
    if("taps_width" in parameters && (!is_number(parameters.taps_width) || !Number.isInteger(parameters.taps_width) || parameters.taps_width < MIN_TAPS_WIDTH || parameters.taps_width > MAX_TAPS_WIDTH)){
        errors.taps_width = "The width of the taps has to be a whole number of bits, from " + MIN_TAPS_WIDTH + " to " + MAX_TAPS_WIDTH;
    }

    const edges = BAND_ORDER[parameters.type];
    if(edges === undefined) return errors;

    const nyquist = is_number(fs) && fs > 0 ? fs / 2 : undefined;
    for(const name of edges){
        const value = parameters[name];
        if(!is_number(value)) errors[name] = "The frequency has to be a number";
        else if(value <= 0) errors[name] = "The frequency has to be above 0";
        else if(nyquist !== undefined && value > nyquist) errors[name] = "The frequency cannot be above half the sampling frequency (" + nyquist + ")";
    }

    // each edge is above the one before it, and the two of a pair that are not are both marked
    for(let i = 1; i < edges.length; i++){
        const below = edges[i - 1]!;
        const above = edges[i]!;
        if(is_number(parameters[below]) && is_number(parameters[above]) && parameters[above] <= parameters[below]){
            errors[above] ??= "It has to be above " + label_of(below);
            errors[below] ??= "It has to be below " + label_of(above);
        }
    }

    return errors;
};

const label_of = (name: string) => name.replace(/_/g, " ");
