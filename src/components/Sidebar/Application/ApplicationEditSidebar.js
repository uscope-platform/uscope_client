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

import React, {useState} from 'react';

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

import {
    create_channel, create_channel_group,
    create_irv,
    create_macro,
    create_parameter,
    create_peripheral_entry
} from "../../../utilities/ApplicationUtilities";
import {PlotChannelGroupProperties} from "../../UI_elements/SidebarComponents/PlotChannelGroupProperties";
import {edit_application} from "../../../client_core";


let  ApplicationEditSidebar = props =>{
    const settings = useSelector(state => state.settings);
    const applications = useSelector(state => state.applications)

    const [new_channel, set_new_channel] = useState(false);
    const [new_irv, set_new_irv] = useState(false);
    const [new_macro, set_new_macro] = useState(false);
    const [new_parameter, set_new_parameter] = useState(false);
    const [new_peripheral, set_new_peripheral] = useState(false);
    const [new_misc, set_new_misc] = useState(false);
    const [new_ch_group, set_new_ch_group] = useState(false);

    let handle_add_item_done = (event) =>{
        let edit = {};
        if(event.key==="Enter"|| event.key ==="Tab"){
            switch (event.target.name) {
                case "ch_group":
                    edit = {application:settings.current_application, group:create_channel_group(event.target.value), action:"add_channel_group"};
                    set_new_ch_group(false);
                    break;
                case "channel":
                    edit = {application:settings.current_application, channel:create_channel(event.target.value), action:"add_channel"};
                    set_new_channel(false);
                    break;
                case "irv":
                    edit = {application:settings.current_application, irv:create_irv(event.target.value), action:"add_irv"};
                    set_new_irv(false);
                    break;
                case"macro":
                    edit = {application:settings.current_application, macro:create_macro(event.target.value), action:"add_macro"};
                    set_new_macro(false);
                    break;
                case"parameter":
                    edit = {application:settings.current_application, parameter:create_parameter(event.target.value), action:"add_parameter"};
                    set_new_parameter(false);
                    break;
                case"peripheral":
                    edit = {application:settings.current_application, peripheral:create_peripheral_entry(event.target.value), action:"add_peripheral"};
                    set_new_parameter(false);
                    break;
                case "misc":
                    edit = {application:settings.current_application, field: {name:event.target.value, value:"0"}, action:"add_misc"};
                    set_new_misc(false);
                    break;
                default:
                    return;
            }
            edit_application(edit)
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



    let render_misc_fields = () =>{
        let fields_list = [];
        for(let field_name in applications[settings.current_application]){
            let value = applications[settings.current_application][field_name];
            if(!Array.isArray(value))
                fields_list.push({name:field_name, value:value})
        }

        return fields_list.map((field)=>{
            return(
                <ApplicationMiscFieldProperties application={settings.current_application} field={field}/>
            )
        })
    }

    if(!settings.current_application)
        return <></>;

    return (
        <SidebarContentLayout application>
            <BlockTitle>{applications[settings.current_application].application_name}</BlockTitle>

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
                            applications[settings.current_application].channel_groups.map((group)=>{
                                return(
                                    <PlotChannelGroupProperties application={settings.current_application} group={group}/>
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
                        applications[settings.current_application].channels.map((channel)=>{
                            return(
                                <PlotChannelProperties application={settings.current_application} channel={channel}/>
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
                        applications[settings.current_application].initial_registers_values.map((irv)=>{
                            return(
                                <InitialRegisterValue application={settings.current_application} irv={irv}/>
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
                        applications[settings.current_application].macro.map((macro)=>{
                            return(
                                <MacroProperties application={settings.current_application} macro={macro}/>
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
                        applications[settings.current_application].parameters.map((parameter)=>{
                            return(
                                <ParameterProperties application={settings.current_application} parameter={parameter}/>
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
                        applications[settings.current_application].peripherals.map((peripheral)=>{
                            return(
                                <ApplicationPeripheralProperties application={settings.current_application} peripheral={peripheral}/>
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
                        render_misc_fields()
                    }
                </StyledScrollbar>
            </SidebarBlockLayout>
        </SidebarContentLayout>
    );
};

export default ApplicationEditSidebar;
