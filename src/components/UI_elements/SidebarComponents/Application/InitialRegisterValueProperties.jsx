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

import React from "react";
import {InputField} from "../../InputField";

import {up_application} from "../../../../client_core";
import {Card} from "../../panels/Card";

export let  InitialRegisterValue = props =>{


    let handleonKeyDown = (event) =>{
        if(event.key==="Enter"|| event.key ==="Tab"){
            let app = new up_application(props.application);
            app.edit_irv(props.irv.address,event.target.name, event.target.value).then(()=>{
                props.forceUpdate();
            });
        }
    }

    let handleRemove= () =>{
        let app = new up_application(props.application);
        app.remove_irv(props.irv.address).then(()=>{
            props.forceUpdate();
        });
    }



    return(
        <Card
            name={props.irv.address}
            onRemove={handleRemove}
        >
            <InputField inline ID="address" name="address" defaultValue={props.irv.address} onKeyDown={handleonKeyDown} label="Address"/>
            <InputField inline ID="value" name='value' defaultValue={props.irv.value} onKeyDown={handleonKeyDown} label="Value"/>
        </Card>
    );
};