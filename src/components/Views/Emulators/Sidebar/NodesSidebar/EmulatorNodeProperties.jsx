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

import {SimpleContent, UIPanel} from "@UI";
import NodeIomProperties from "./NodeIomProperties";
import EmulatorCoreProperties from "./EmulatorCoreProperties";
import EmulatorCoreDeploymentProperties from "./EmulatorCoreDeploymentProperties";

let  EmulatorNodeProperties = props =>{


    if(props.enabled && props.selected_emulator){
        let selected_core = Object.values(props.selected_emulator.cores).filter((item)=>{
            return item.id === props.selected_component.obj.id;
        })[0];

        const render_core_deploy_properties = () =>{
            if(props.selected_emulator.deployment_mode){
                return(
                    <UIPanel key={"Deployment Properties"}  level="level_2">
                        <SimpleContent name={"Deployment Properties"} content={
                            <EmulatorCoreDeploymentProperties
                                selected_core={selected_core}
                                deployment={selected_core.deployment}
                                emulator={props.selected_emulator}
                            />
                        } />
                    </UIPanel>
                )
            }
        }
        return(
            <div style={{
                display: "flex",
                flexDirection: "column",
                gap:10
            }}>
                <UIPanel key={"Item properties"}  level="level_2">
                    <SimpleContent name={"Node Properties"} content={
                        <EmulatorCoreProperties
                            selected_core={selected_core}
                            selected_emulator={props.selected_emulator}
                            selected_component={props.selected_component}
                            bump_version={props.bump_version}
                        />
                    } />
                </UIPanel>
                {render_core_deploy_properties()}
                <UIPanel style={{minHeight:"200px"}} key={"iom properties"} level="level_2">
                    <NodeIomProperties
                        selected_core={selected_core}
                        selected_iom={props.selected_iom}
                        selected_emulator={props.selected_emulator}
                        selected_component={props.selected_component}
                        on_iom_modify={props.on_iom_modify}
                    />
                </UIPanel>
            </div>
        );
    }

};

export default EmulatorNodeProperties;
