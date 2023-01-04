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

import React, {useReducer, useState} from 'react';

import {useSelector} from "react-redux";


import {up_application} from "../../client_core";
import {
    ApplicationMiscFieldProperties,
    ApplicationPeripheralProperties, ApplicationSoftCoreProperties,
    InitialRegisterValue,
    InputField, MacroProperties, ParameterProperties,
    PlotChannelGroupProperties,
    PlotChannelProperties,
    StyledScrollbar,
    TabbedContent,
    UIPanel
} from "../UI_elements";
import {Responsive, WidthProvider} from "react-grid-layout";
import {Add} from "grommet-icons";

let initial_new_fields_state = {
    "channel":false,
    "irv":false,
    "macro":false,
    "parameter":false,
    "peripheral":false,
    "core":false,
    "misc":false,
    "ch_group":false
};


let  ApplicationSidebar = props =>{
    const selected_application =  useSelector(state => new up_application(state.applications[state.settings.current_application]))

    const settings = useSelector(state => state.settings);
    const peripherals = useSelector(state => state.peripherals);
    const programs = useSelector(state => state.programs);
    const [, forceUpdate] = useReducer(x => x + 1, 0);


    const [new_fields, set_new_fields] = useState(initial_new_fields_state);


    const ResponsiveGridLayout = WidthProvider(Responsive);

    let update_fields = (field, status) =>{
        let next_state = new_fields;
        next_state[field] = status;
        set_new_fields(next_state);
        forceUpdate();
    }

    let handle_add_item_done = (event) =>{
        if(event.key==="Enter"|| event.key ==="Tab"){
            update_fields(event.target.name, false);
            switch (event.target.name) {
                case "ch_group":
                    selected_application.add_channel_group(event.target.value);
                    break;
                case "channel":
                    selected_application.add_channel(event.target.value);
                    break;
                case "irv":
                    selected_application.add_irv(event.target.value);
                    break;
                case"macro":
                    selected_application.add_macro(event.target.value);
                    break;
                case"parameter":
                    selected_application.add_parameter(event.target.value);
                    break;
                case"peripheral":
                    selected_application.add_peripheral(event.target.value);
                    break;
                case"soft_core":
                    selected_application.add_soft_core(event.target.value);
                    break;
                case "misc":
                    selected_application.set_misc_param(event.target.value);
                    break;
                default:
                    return;
            }
            forceUpdate();
        }
    }

    let handle_add_item = (event) =>{
        debugger;
        update_fields(event.target.id, true);
    }


    let get_tabs_content = ()=>{
        return([
            <div>
                {new_fields.channel ?
                    <InputField name="channel" compact label="Channel Name" onKeyDown={handle_add_item_done}/>:
                    <Add id="channel" size={"medium"} onClick={handle_add_item} color='white'/>

                }
                <StyledScrollbar>
                    {
                        selected_application.channels.map((channel)=>{
                            return(
                                <PlotChannelProperties application={selected_application} forceUpdate={forceUpdate} channel={channel}/>
                            )
                        })
                    }
                </StyledScrollbar>
            </div>,
            <div>
                {new_fields.ch_group ?
                    <InputField name="ch_group" compact label="Channel Group Name" onKeyDown={handle_add_item_done}/>:
                    <Add id="ch_group" size={"medium"} onClick={handle_add_item} color='white'/>
                }
                <StyledScrollbar>
                    {
                        selected_application.channel_groups.map((group)=>{
                            return(
                                <PlotChannelGroupProperties application={selected_application} forceUpdate={forceUpdate} group={group}/>
                            )
                        })
                    }
                </StyledScrollbar>
            </div>,
            <div>
                {new_fields.irv ?
                    <InputField name="irv" compact label="Register Address" onKeyDown={handle_add_item_done}/>:
                    <Add id="irv"  size={"medium"} onClick={handle_add_item} color='white'/>
                }
                <StyledScrollbar>
                    {
                        selected_application.initial_registers_values.map((irv)=>{
                            return(
                                <InitialRegisterValue application={selected_application} forceUpdate={forceUpdate} irv={irv}/>
                            )
                        })
                    }
                </StyledScrollbar>
            </div>,
            <div>
                {new_fields.macro ?
                    <InputField name="macro" compact label="Macro Name" onKeyDown={handle_add_item_done}/> :
                    <Add  id="macro" size={"medium"} onClick={handle_add_item} color='white'/>
                }
                <StyledScrollbar>
                    {
                        selected_application.macro.map((macro)=>{
                            return(
                                <MacroProperties application={selected_application} forceUpdate={forceUpdate} macro={macro}/>
                            )
                        })
                    }
                </StyledScrollbar>
            </div>,
            <div>
                {new_fields.parameter ?
                    <InputField name="parameter" compact label="Parameter Name" onKeyDown={handle_add_item_done}/>:
                    <Add id="parameter" size={"medium"} onClick={handle_add_item} color='white'/>
                }
                <StyledScrollbar>
                    {
                        selected_application.parameters.map((parameter)=>{
                            return(
                                <ParameterProperties application={selected_application} forceUpdate={forceUpdate} parameter={parameter}/>
                            )
                        })
                    }
                </StyledScrollbar>
            </div>,
            <div>
                {new_fields.peripheral ?
                    <InputField name="peripheral" compact label="Peripheral Name" onKeyDown={handle_add_item_done}/>:
                    <Add id="peripheral"  size={"medium"} onClick={handle_add_item} color='white'/>
                }
                <StyledScrollbar>
                    {
                        selected_application.peripherals.map((peripheral)=>{
                            return(
                                <ApplicationPeripheralProperties application={selected_application} peripherals={peripherals} forceUpdate={forceUpdate} peripheral={peripheral}/>
                            )
                        })
                    }
                </StyledScrollbar>
            </div>,
            <div>
                {new_fields.soft_core ?
                    <InputField name="soft_core" compact label="Field Name" onKeyDown={handle_add_item_done}/>:
                    <Add id="soft_core"  size={"medium"} onClick={handle_add_item} color='white'/>
                }
                <StyledScrollbar>
                    {
                        selected_application.soft_cores.map((soft_core)=>{
                            return(
                                <ApplicationSoftCoreProperties application={selected_application} core={soft_core} programs={programs} forceUpdate={forceUpdate}/>
                            )
                        })
                    }
                </StyledScrollbar>
            </div>,
            <div>
                {new_fields.misc ?
                    <InputField name="misc" compact label="Field Name" onKeyDown={handle_add_item_done}/>:
                    <Add id="misc"  size={"medium"} onClick={handle_add_item} color='white'/>
                }
                <StyledScrollbar>
                    {
                        Object.keys(selected_application).map((key, index) =>{
                            if(!Array.isArray(selected_application[key]) && typeof selected_application[key] !== 'function')
                                return <ApplicationMiscFieldProperties application={selected_application} forceUpdate={forceUpdate} field={{name:key, value:selected_application[key]}}/>
                        })
                    }
                </StyledScrollbar>
            </div>
        ])
    }

    let get_tabs_names = ()=>{
        return ["Channels", "Channel Groups","IRV", "Macro", "Parameters", "Peripherals", "Cores", "Misc"]
    }

    if(!settings.current_application)
        return <></>;

    if(selected_application.application_name)
        return(
            <ResponsiveGridLayout
                className="layout"
                breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                cols={{ lg: 24, md: 20, sm: 12, xs: 8, xxs: 4 }}
            >
                <UIPanel key="new_props" data-grid={{x: 2, y: 0, w: 24, h: 6}} level="level_2">
                    <TabbedContent names={get_tabs_names()} contents={get_tabs_content()}/>
                </UIPanel>
            </ResponsiveGridLayout>
        );


};

export default ApplicationSidebar;
