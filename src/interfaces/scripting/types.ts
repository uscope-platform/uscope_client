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

import type {fields_object} from "#client_core/data_models/register_proxy.js";
import type {peripheral, peripheral_instance} from "#interfaces/index.js";

export interface autocomplete_periph_object {
    regs:Record<string, fields_object>,
    periph_obj:peripheral_instance,
    spec_obj:peripheral
}

export interface register_write_object {
    periph_id:string,
    spec_id:number,
    reg_id:string,
    access_type:string,
    field_spec:any,
    field_name:string
}

export interface autocompletion_context{
    from: number,
    to:number,
    text:string
}

export interface autocomplete_suggestion{
    label:string,
    type:string
}