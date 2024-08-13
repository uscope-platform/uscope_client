// Copyright 2023 Filippo Savi
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

import React from 'react';

import {Checkbox, InputField} from "../../../../UI_elements";

let  EmulatorCoreDeploymentProperties = props =>{

    let handle_change_address = async (event) =>{
        if(event.key==="Enter"|| event.key ==="Tab") {
            let new_deployment = props.deployment;
            new_deployment[event.target.name] = parseInt(event.target.value, 0);
            await props.emulator.edit_deployment_options(props.selected_core.id, new_deployment);
        }
    }

    let handle_change_reciprocal = async (event) =>{
        let new_deployment = props.deployment;
        new_deployment[event.target.name] = event.target.checked;
        await props.emulator.edit_deployment_options(props.selected_core.id, new_deployment);
    }

    return(
        <div>
            <InputField inline id="rom_address" name="rom_address" label="Code address"
                        defaultValue={"0x" + props.deployment.rom_address.toString(16)} onKeyDown={handle_change_address}/>
            <InputField inline id="control_address" name="control_address" label="Control address"
                        defaultValue={"0x" + props.deployment.control_address.toString(16)} onKeyDown={handle_change_address}/>
            <Checkbox name='has_reciprocal' value={props.deployment.has_reciprocal} onChange={handle_change_reciprocal} label="Reciprocal Support"/>
        </div>
    );
};

export default EmulatorCoreDeploymentProperties;
