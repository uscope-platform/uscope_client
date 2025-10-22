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

import {Checkbox, InputField} from "#UI/index.js";
import type {core, core_deployment_options} from "#interfaces/index.js";
import {up_emulator} from "#client_core/index.js";

interface EmulatorCoreDeploymentPropertiesProps {
    deployment: core_deployment_options,
    emulator: up_emulator,
    selected_core: core,
}

let  EmulatorCoreDeploymentProperties = (props: EmulatorCoreDeploymentPropertiesProps) =>{

    let handle_change_address = async (event: React.KeyboardEvent<HTMLInputElement>) =>{
        if(event.key==="Enter"|| event.key ==="Tab") {
            let prop =event.currentTarget.name as keyof core_deployment_options;
            await props.emulator.edit_deployment_options(props.selected_core.id, prop, parseInt(event.currentTarget.value, 0));
        }
    }

    let handle_change_reciprocal = async (event: React.ChangeEvent<HTMLInputElement>) =>{

        let prop =event.currentTarget.name as keyof core_deployment_options;
        await props.emulator.edit_deployment_options(props.selected_core.id, prop, event.currentTarget.checked);
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
