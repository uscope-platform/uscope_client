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

import React from 'react';

import {BlockLayout, BlockTitle, Button} from "../UI_elements"
import {useDispatch, useSelector} from "react-redux";
import {context_cleaner, parseFunction} from "../../user_script_launcher";

import {saveScriptsWorkspace} from "../../redux/Actions/scriptsActions";
import styled from "styled-components";


const ButtonGrid = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-items: center;
    gap: 1em;
`

let  MacroActions = props =>{
    const scripts = useSelector(state => state.scripts);

    const applications = useSelector(state => state.applications)
    const settings = useSelector(state => state.settings);
    const actions = applications[settings['application']]['macro'];
    const peripheral_specs = useSelector( state => state.peripherals);
    const app_peripherals = applications[settings['application']]['peripherals'];
    const registers_redux = useSelector(state => state.registerValues);
    let parameters = applications[settings["application"]].parameters;
    const scripts_workspace = useSelector(state => state.scriptsWorkspace);
    const dispatch = useDispatch();

    let onClick = (event) => {
        let scriptTrigger = event.target.name;
        let trigger = Object.values(scripts).filter((script)=>{
            return script.triggers.includes(scriptTrigger);
        });
        let content = trigger[0].script_content;

        let context = context_cleaner(registers_redux, parameters, "");
        context["workspace"] = scripts_workspace;
        let {workspace, registers} = parseFunction(content)(null, context);
        if(workspace!== null){
            dispatch(saveScriptsWorkspace(workspace))
        }
        if(registers!== null){
            let bulk_registers = [];
            // eslint-disable-next-line
            for(let reg in registers){
                let [periph_id, reg_id] = reg.split('.');
                let periph = app_peripherals.filter((periph)=>{
                    return periph.peripheral_id === periph_id;
                })[0];
                let reg_offset = peripheral_specs[periph.spec_id].registers.filter((reg)=>{
                    return reg.ID === reg_id;
                })[0].offset;
                if(periph.proxied){
                    if(periph.proxy_type==='rtcu'){
                        let address = parseInt(periph.base_address)+parseInt(reg_offset);
                        bulk_registers.push({address:parseInt(periph.proxy_address), value:registers[reg]});
                        bulk_registers.push({address:parseInt(periph.proxy_address)+4, value:address});

                    } else if(periph.proxy_type === 'axis_const'){
                        let address = parseInt(periph.base_address)+parseInt(reg_offset);
                        bulk_registers.push({address:parseInt(periph.proxy_address)+4, value:address});
                        bulk_registers.push({address:parseInt(periph.proxy_address), value:registers[reg]});
                    }
                } else{
                    let address = parseInt(periph.base_address)+parseInt(reg_offset);
                    bulk_registers.push({address:address, value:registers[reg]})
                }

            }

            settings.server.periph_proxy.bulkRegisterWrite({payload:bulk_registers});
        }
    };

    return(
        <BlockLayout centered>
            <BlockTitle>Macros</BlockTitle>
            <ButtonGrid>
                {actions.map((macro) => {
                    return(
                        <div key={macro.name} style={{margin:'0.5rem'}}>
                            <Button key={macro.name} className="macro_action_buttons" name={macro.trigger} onClick={onClick}>{macro.name}</Button>
                        </div>
                    );
                })}
            </ButtonGrid>
        </BlockLayout>
    );
};

export default MacroActions;