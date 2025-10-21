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

export interface auth_request{
    user:string,
    password:string,
    remember_me: boolean,
    login_type: "user"| "automated"
}

export interface user_model{
    username:string,
    role:string
}
export interface user_create_request{
    user:string,
    password:string,
    role:string
}

export interface scope_control {
    level:number,
    level_type: "int"| "float",
    mode:"rising_edge" | "falling_edge" | "both_edges",
    trigger:number,
    prescaler: number,
    source: number,
    trigger_point:number
}

export type ScopeStatus = "unknown" | "run" | "free run" | "wait" | "stop";


export interface scope_settings{
    address:number,
    dma_buffer_offset: number
}

export interface scope_data_object{
    channel:number,
    data:number[]
}

export interface register_write{
    type:"direct" | "proxied"
    access_type?:"field" | "full_reg",
    proxy_type:string,
    proxy_address:number,
    address:number,
    value:number
}