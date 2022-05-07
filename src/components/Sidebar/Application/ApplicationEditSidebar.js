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

import {
    ApplicationMiscFieldProperties,
    ApplicationPeripheralProperties,
    BlockTitle,
    InitialRegisterValue,
    InputField,
    MacroProperties,
    ParameterProperties,
    PlotChannelProperties,
    SidebarBlockLayout,
    SidebarBlockTitleLayout,
    SidebarContentLayout,
    StyledScrollbar
} from "../../UI_elements";

import {Add} from "grommet-icons";

import {PlotChannelGroupProperties} from "../../UI_elements/SidebarComponents/PlotChannelGroupProperties";


let  ApplicationEditSidebar = props =>{
    const settings = useSelector(state => state.settings);
    const [, forceUpdate] = useReducer(x => x + 1, 0);




    const [new_channel, set_new_channel] = useState(false);
    const [new_irv, set_new_irv] = useState(false);
    const [new_macro, set_new_macro] = useState(false);
    const [new_parameter, set_new_parameter] = useState(false);
    const [new_peripheral, set_new_peripheral] = useState(false);
    const [new_misc, set_new_misc] = useState(false);
    const [new_ch_group, set_new_ch_group] = useState(false);

    let handle_add_item_done = (event) =>{
        if(event.key==="Enter"|| event.key ==="Tab"){
            switch (event.target.name) {
                case "ch_group":
                    props.selected_application.add_channel_group(event.target.value);
                    set_new_ch_group(false);
                    break;
                case "channel":
                    props.selected_application.add_channel(event.target.value);
                    set_new_channel(false);
                    break;
                case "irv":
                    props.selected_application.add_irv(event.target.value);
                    set_new_irv(false);
                    break;
                case"macro":
                    props.selected_application.add_macro(event.target.value);
                    set_new_macro(false);
                    break;
                case"parameter":
                    props.selected_application.add_parameter(event.target.value);
                    set_new_parameter(false);
                    break;
                case"peripheral":
                    props.selected_application.add_peripheral(event.target.value);
                    set_new_parameter(false);
                    break;
                case "misc":
                    props.selected_application.set_misc_param(event.target.value);
                    set_new_misc(false);
                    break;
                default:
                    return;
            }
            forceUpdate();
        }
    }

    let handle_add_item = (event) =>{
        switch (event.target.id) {
            case "channel":
                set_new_channel(true);
                break;
            case "irv":
                set_new_irv(true);
                break;
            case"macro":
                set_new_macro(true);
                break;
            case"parameter":
                set_new_parameter(true);
                break;
            case"peripheral":
                set_new_peripheral(true);
                break;
            case "misc":
                set_new_misc(true);
                break;
            case "ch_group":
                set_new_ch_group(true);
                break;
            default:
                return;
        }
    }



    if(!settings.current_application)
        return <></>;

    return (
        <SidebarContentLayout application>
            <BlockTitle>{props.selected_application.application_name}</BlockTitle>

            <SidebarBlockLayout>
                <SidebarBlockTitleLayout>
                    <label style={{fontSize:'20px',fontWeight:600}}>{"Channel Groups"}</label>
                    <Add id="ch_group" size={"medium"} onClick={handle_add_item} color='white'/>
                </SidebarBlockTitleLayout>
                    {new_ch_group &&
                        <InputField name="ch_group" compact label="Channel Group Name" onKeyDown={handle_add_item_done}/>
                    }
                <StyledScrollbar>
                        {
                            props.selected_application.channel_groups.map((group)=>{
                                return(
                                    <PlotChannelGroupProperties application={props.selected_application} forceUpdate={forceUpdate} group={group}/>
                                )
                            })
                        }
                </StyledScrollbar>
            </SidebarBlockLayout>

            <SidebarBlockLayout>
                <SidebarBlockTitleLayout>
                    <label style={{fontSize:'20px',fontWeight:600}}>{"Channels"}</label>
                    <Add id="channel" size={"medium"} onClick={handle_add_item} color='white'/>
                </SidebarBlockTitleLayout>
                {new_channel &&
                <InputField name="channel" compact label="Channel Name" onKeyDown={handle_add_item_done}/>
                }
                <StyledScrollbar>
                    {
                        props.selected_application.channels.map((channel)=>{
                            return(
                                <PlotChannelProperties application={props.selected_application} forceUpdate={forceUpdate} channel={channel}/>
                            )
                        })
                    }
                </StyledScrollbar>
            </SidebarBlockLayout>

            <SidebarBlockLayout>
                <SidebarBlockTitleLayout>
                    <label style={{fontSize:'20px',fontWeight:600}}>{"Initial Register Values"}</label>
                    <Add id="irv"  size={"medium"} onClick={handle_add_item} color='white'/>
                </SidebarBlockTitleLayout>
                {new_irv &&
                    <InputField name="irv" compact label="Register Address" onKeyDown={handle_add_item_done}/>
                }
                <StyledScrollbar>
                    {
                        props.selected_application.initial_registers_values.map((irv)=>{
                            return(
                                <InitialRegisterValue application={props.selected_application} forceUpdate={forceUpdate} irv={irv}/>
                            )
                        })
                    }
                </StyledScrollbar>
            </SidebarBlockLayout>

            <SidebarBlockLayout>
                <SidebarBlockTitleLayout>
                    <label style={{fontSize:'20px',fontWeight:600}}>{"Macro"}</label>
                    <Add  id="macro" size={"medium"} onClick={handle_add_item} color='white'/>
                </SidebarBlockTitleLayout>
                {new_macro &&
                    <InputField name="macro" compact label="Macro Name" onKeyDown={handle_add_item_done}/>
                }
                <StyledScrollbar>
                    {
                        props.selected_application.macro.map((macro)=>{
                            return(
                                <MacroProperties application={props.selected_application} forceUpdate={forceUpdate} macro={macro}/>
                            )
                        })
                    }
                </StyledScrollbar>
            </SidebarBlockLayout>

            <SidebarBlockLayout>
                <SidebarBlockTitleLayout>
                    <label style={{fontSize:'20px',fontWeight:600}}>{"Parameters"}</label>
                    <Add id="parameter" size={"medium"} onClick={handle_add_item} color='white'/>
                </SidebarBlockTitleLayout>
                {new_parameter &&
                    <InputField name="parameter" compact label="Parameter Name" onKeyDown={handle_add_item_done}/>
                }
                <StyledScrollbar>
                    {
                        props.selected_application.parameters.map((parameter)=>{
                            return(
                                <ParameterProperties application={props.selected_application} forceUpdate={forceUpdate} parameter={parameter}/>
                            )
                        })
                    }
                </StyledScrollbar>
            </SidebarBlockLayout>

            <SidebarBlockLayout>
                <SidebarBlockTitleLayout>
                    <label style={{fontSize:'20px',fontWeight:600}}>{"Peripherals"}</label>
                    <Add id="peripheral"  size={"medium"} onClick={handle_add_item} color='white'/>
                </SidebarBlockTitleLayout>
                {new_peripheral &&
                    <InputField name="peripheral" compact label="Peripheral Name" onKeyDown={handle_add_item_done}/>
                }
                <StyledScrollbar>
                    {
                        props.selected_application.peripherals.map((peripheral)=>{
                            return(
                                <ApplicationPeripheralProperties application={props.selected_application} forceUpdate={forceUpdate} peripheral={peripheral}/>
                            )
                        })
                    }
                </StyledScrollbar>
            </SidebarBlockLayout>

            <SidebarBlockLayout>
                <SidebarBlockTitleLayout>
                    <label style={{fontSize:'20px',fontWeight:600}}>{"Miscelaneous"}</label>
                    <Add id="misc"  size={"medium"} onClick={handle_add_item} color='white'/>
                </SidebarBlockTitleLayout>
                {new_misc &&
                <InputField name="misc" compact label="Field Name" onKeyDown={handle_add_item_done}/>
                }
                <StyledScrollbar>
                    {
                        Object.keys(props.selected_application).map((key, index) =>{
                            if(!Array.isArray(props.selected_application[key]) && typeof props.selected_application[key] !== 'function')
                                return <ApplicationMiscFieldProperties application={props.selected_application} forceUpdate={forceUpdate} field={{name:key, value:props.selected_application[key]}}/>
                        })
                    }
                </StyledScrollbar>
            </SidebarBlockLayout>
        </SidebarContentLayout>
    );
};

export default ApplicationEditSidebar;
