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

export const context_cleaner = (parameters, current_parameter) => {
    //purge register context of unwanted and potentially dangerous fields

    //purge parameters context of unwanted and potentially dangerous fields
    let parameters_context = {};
    parameters.map((param) => {
        if (current_parameter !== param.parameter_id) {
            parameters_context[param.parameter_id] = param.value;
        }
        return null;
    });
    return {parameters: parameters_context};
};


export const parseFunction = function (string) {
    let funcReg = /function (\S*) *\(([^()]*)\)[ \n\t]*{(.*)}/gmi;
    let match = funcReg.exec(string.replace(/(\r\n|\n|\r)/gm, ""));
    if (match) {
        // eslint-disable-next-line
        return new Function(match[2].split(','), match[3]);
    }
    return null;
};