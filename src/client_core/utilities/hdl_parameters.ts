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

import type {hdl_integer, hdl_parameter} from "#interfaces/index.js";

const INT64_MAX = (1n << 63n) - 1n;
const INT64_MIN = -(1n << 63n);

export const is_hdl_integer = (parameter: unknown): parameter is hdl_integer =>
    typeof parameter === "object" && parameter !== null && typeof (parameter as hdl_integer).value === "number";

const to_bigint = (parameter: hdl_integer): bigint =>
    parameter.wide ? BigInt(parameter.wide_value) : BigInt(parameter.value);

/// The number of a parameter, whatever form it is stored in
export const parameter_number = (parameter: hdl_parameter | undefined): number | undefined => {
    if(parameter === undefined) return undefined;
    return is_hdl_integer(parameter) ? Number(to_bigint(parameter)) : parameter;
};

/// What an expression of the peripheral specifications (the number of registers, of fields) evaluates to: either the
/// name of a parameter or a literal number
export const resolve_parameter = (expression: string, parameters: Record<string, hdl_parameter>): number => {
    const value = parameter_number(parameters[expression]);
    return value !== undefined ? value : parseInt(expression);
};

/// The parameter as text, the full number when it does not fit 64 bits
export const format_parameter = (parameter: hdl_parameter): string => {
    if(is_hdl_integer(parameter)) return parameter.wide ? to_bigint(parameter).toString() : String(parameter.value);
    return String(parameter);
};

/// The parameter holding the number typed, in the form of the one it replaces. Returns null when it is not a number
export const parse_parameter = (text: string, previous: hdl_parameter): hdl_parameter | null => {
    let number: bigint;
    try {
        if(text.trim() === "") return null;
        number = BigInt(text.trim());
    } catch {
        return null;
    }
    if(!is_hdl_integer(previous)) return Number(number);
    const wide = number > INT64_MAX || number < INT64_MIN;
    return {
        ...previous,
        value: Number(BigInt.asIntN(64, number)),
        wide: wide,
        wide_value: (number < 0n ? "-0x" + (-number).toString(16) : "0x" + number.toString(16))
    };
};
