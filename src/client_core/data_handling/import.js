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

import Ajv2020 from "ajv/dist/2020"
import application_schema from "./application.schema.json"
import peripheral_schema from "./peripheral.schema.json"
import {up_application} from "../data_models/up_application";
import {up_peripheral} from "../data_models/up_peripheral";


let validate_json = (obj, schema) => {
    const ajv = new Ajv2020()
    const validate = ajv.compile(schema)
    const valid = validate(obj)
    let erorr_strings = [];
    if(!valid){
        for(let i of validate.errors){
            erorr_strings.push('Error at: "' +i.instancePath + '" --- ' + i.message);
        }
    }
    return [valid, erorr_strings]
}

export const import_application = (raw_json) => {
    let imported_app = JSON.parse(raw_json);
    let [valid, errors] = validate_json(imported_app, application_schema);
    if(valid){
        let app = new up_application(imported_app);
        return app.add_remote().then(()=>{
            return []
        })
    } else{
        return Promise.reject(errors)
    }
}

export const import_peripherals = (raw_json) => {
    let imported_periph = JSON.parse(raw_json);
    let [valid, errors] = validate_json(imported_periph, peripheral_schema);
    if(valid){
        let promises = [];
        for(const periph_item in imported_periph){
            let periph = new up_peripheral(imported_periph[periph_item]);
            promises.push(periph.add_remote().then(()=>{
                return [];
            }))
        }
        return Promise.all(promises);
    } else{
        return Promise.reject(errors)
    }
}