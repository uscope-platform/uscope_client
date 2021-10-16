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

import axios from "axios"
import {sendRegister} from "../redux/Actions/RegisterActions";
import {loadPeripherals} from "../redux/Actions/peripheralsActions";
import store from "../store";


let PeripheralProxy = class{

    getPeripheralRegisters =  (peripheral_name) => {
        return new Promise( (resolve, reject) => {
            let state = store.getState();
            axios.get(state.settings.server_url+'registers/'+peripheral_name+'/descriptions', state.settings.auth_config)
                .then(res => {
                    resolve(res.data);
                })
        });
    };

    bulkRegisterWrite = (registers) =>{
        return new Promise( (resolve, reject) => {
            let state = store.getState();
            axios.post(state.settings.server_url+'registers/bulk_write', registers, state.settings.auth_config)
                .then(res => {
                    resolve(res.data);
                })
        });
    };

    /**
     * This method sets the value of a register
     * @param {Object} register - An object containing the details of the register to set;
     * @param {String} register.name - Name of the register to set.
     * @param {String} register.peripheral - Name of the peripheral whose register has to be set.
     * @param {Number} register.value - Value to set the register to.
     */
    setRegisterValue = (register) => {
        let state = store.getState();
        store.dispatch(sendRegister(state.settings.server_url+'registers/'+register.peripheral+'/value', register, state.settings.auth_config))
    };

    load_all = () =>{
        let state = store.getState();
        store.dispatch(loadPeripherals(state.settings.server_url+'registers/all_peripheral/descriptions', state.settings.auth_config))
    };

    get_hash = () =>{
        return new Promise( (resolve, reject) => {
            let state = store.getState();
            axios.get(state.settings.server_url+'registers/digest', state.settings.auth_config)
                .then(res => {
                    resolve(res.data);
                })
        });
    }

};

export default PeripheralProxy;

