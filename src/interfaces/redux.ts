/*
 * Copyright(c) 2025. Filippo Savi
 * Author: Filippo Savi <filssavi@gmail.com>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */

import {up_application, up_bitstream, up_filter, up_program, up_script} from "#client_core/index.js";

export interface ApplicationsState {
    [key: number]: up_application
}

export type parameter_save_action = {
    name: string,
    value: number,
    app: number
}

export interface BitstreamState{
    [key:number]: up_bitstream
}

export interface FilterState{
    [key:number]: up_filter
}

export interface ScriptState{
    [key:number]: up_script
}


export interface ProgramState{
    [key:number]: up_program
}