// Copyright 2025 Filippo Savi
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



import type {rpu_program_model} from "#interfaces/index.js";

/// The start of the hash of the file of a program, enough to tell the versions of it apart in a list
export const short_hash = (program: rpu_program_model): string => program.hash !== undefined ? program.hash.slice(0, 10) : "";

/// What the list shows under the name of a program: the core it runs on and its version
export const program_description = (program: rpu_program_model): string => {
    const hash = short_hash(program);
    return "Core " + program.core + (hash !== "" ? " · " + hash : "");
};

/// The cores of the RPU a program can run on
export const RPU_CORES = [0, 1] as const;
