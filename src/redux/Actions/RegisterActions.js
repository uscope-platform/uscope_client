// Copyright 2021 University of Nottingham Ningbo China
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

import {LOAD_REGISTERS, SEND_REGISTER} from "./types";
import axios from "axios";

export const sendRegister = (server_url ,register, config) => {
    return dispatch => {
        return axios.post(server_url,{payload:register}, config).then(resp => {
            dispatch(sendRegisterDone(register));
            return resp;
        }).catch(err => {
            alert('ERROR: error while sending a resiter to the server\n' + err.message);
        });
    };
};

const sendRegisterDone = (register) => ({
    type: SEND_REGISTER,
    payload:{
        name: register.name,
        peripheral: register.peripheral,
        value: register.value
    }
});


export const loadRegisters = (peripheral, value) =>{
    return{
        type: LOAD_REGISTERS,
        payload:{
            peripheral:peripheral,
            value:value
        }
    }
};


