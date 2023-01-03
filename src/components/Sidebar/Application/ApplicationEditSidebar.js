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
    ApplicationSoftCoreProperties,
    InitialRegisterValue,
    InputField,
    MacroProperties,
    ParameterProperties,
    PlotChannelProperties,
    SidebarBlockLayout,
    SidebarBlockTitleLayout,
    StyledScrollbar,
    PlotChannelGroupProperties
} from "../../UI_elements";

import {Add} from "grommet-icons";
import {DockLayout} from "rc-dock";

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

const FieldsContext = React.createContext();

let  ApplicationEditSidebar = props =>{
    const settings = useSelector(state => state.settings);
    const peripherals = useSelector(state => state.peripherals);
    const programs = useSelector(state => state.programs);
    const [, forceUpdate] = useReducer(x => x + 1, 0);


    const [new_fields, set_new_fields] = useState(initial_new_fields_state);


    let update_fields = (field, status) =>{
        let next_state = new_fields;
        next_state[field] = status;
        set_new_fields(next_state);
    }

    let handle_add_item_done = (event) =>{
        if(event.key==="Enter"|| event.key ==="Tab"){
            update_fields(event.target.name, false);
            switch (event.target.name) {
                case "ch_group":
                    props.selected_application.add_channel_group(event.target.value);
                    break;
                case "channel":
                    props.selected_application.add_channel(event.target.value);
                    break;
                case "irv":
                    props.selected_application.add_irv(event.target.value);
                    break;
                case"macro":
                    props.selected_application.add_macro(event.target.value);
                    break;
                case"parameter":
                    props.selected_application.add_parameter(event.target.value);
                    break;
                case"peripheral":
                    props.selected_application.add_peripheral(event.target.value);
                    break;
                case"soft_core":
                    props.selected_application.add_soft_core(event.target.value);
                    break;
                case "misc":
                    props.selected_application.set_misc_param(event.target.value);
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


    const default_layout = {
        dockbox: {
            mode: 'vertical',
            children: [
                {
                    tabs: [{id: "old", title:"Old Properties", content:
                            (<>
                                    <SidebarBlockLayout>
                                        <SidebarBlockTitleLayout>
                                            <label style={{fontSize:'20px',fontWeight:600}}>{"Channels"}</label>
                                            <Add id="channel" size={"medium"} onClick={handle_add_item} color='white'/>
                                        </SidebarBlockTitleLayout>
                                        <FieldsContext.Consumer>
                                            {(context) => (
                                                <>
                                                    {context.channel ?
                                                        <InputField name="channel" compact label="Channel Name" onKeyDown={handle_add_item_done}/>:null
                                                    }
                                                </>
                                            )}
                                        </FieldsContext.Consumer>
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
                                        <FieldsContext.Consumer>
                                            {(context) => (
                                                <>
                                                    {context.irv ?
                                                        <InputField name="irv" compact label="Register Address" onKeyDown={handle_add_item_done}/>:null
                                                    }
                                                </>
                                            )}
                                        </FieldsContext.Consumer>
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
                                        <FieldsContext.Consumer>
                                            {(context) => (
                                                <>
                                                    {context.macro ?
                                                        <InputField name="macro" compact label="Macro Name" onKeyDown={handle_add_item_done}/> :null
                                                    }
                                                </>
                                            )}
                                        </FieldsContext.Consumer>
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

                                        <FieldsContext.Consumer>
                                            {(context) => (
                                                <>
                                                    {context.parameter ?
                                                        <InputField name="parameter" compact label="Parameter Name" onKeyDown={handle_add_item_done}/>: null
                                                    }
                                                </>
                                            )}
                                        </FieldsContext.Consumer>
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
                                        <FieldsContext.Consumer>
                                            {(context) => (
                                                <>
                                                    {context.peripheral ?
                                                        <InputField name="peripheral" compact label="Peripheral Name" onKeyDown={handle_add_item_done}/>:null
                                                    }
                                                </>
                                            )}
                                        </FieldsContext.Consumer>
                                        <StyledScrollbar>
                                            {
                                                props.selected_application.peripherals.map((peripheral)=>{
                                                    return(
                                                        <ApplicationPeripheralProperties application={props.selected_application} peripherals={peripherals} forceUpdate={forceUpdate} peripheral={peripheral}/>
                                                    )
                                                })
                                            }
                                        </StyledScrollbar>
                                    </SidebarBlockLayout>

                                    <SidebarBlockLayout>
                                        <SidebarBlockTitleLayout>
                                            <label style={{fontSize:'20px',fontWeight:600}}>{"Soft cores"}</label>
                                            <Add id="soft_core"  size={"medium"} onClick={handle_add_item} color='white'/>
                                        </SidebarBlockTitleLayout>
                                        <FieldsContext.Consumer>
                                            {(context) => (
                                                <>
                                                    {context.soft_core ?
                                                        <InputField name="soft_core" compact label="Field Name" onKeyDown={handle_add_item_done}/>:null
                                                    }
                                                </>
                                            )}
                                        </FieldsContext.Consumer>
                                        <StyledScrollbar>
                                            {
                                                props.selected_application.soft_cores.map((soft_core)=>{
                                                    return(
                                                        <ApplicationSoftCoreProperties application={props.selected_application} core={soft_core} programs={programs} forceUpdate={forceUpdate}/>
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
                                        <FieldsContext.Consumer>
                                            {(context) => (
                                                <>
                                                    {context.misc ?
                                                        <InputField name="misc" compact label="Field Name" onKeyDown={handle_add_item_done}/>:null
                                                    }
                                                </>
                                            )}
                                        </FieldsContext.Consumer>

                                        <StyledScrollbar>
                                            {
                                                Object.keys(props.selected_application).map((key, index) =>{
                                                    if(!Array.isArray(props.selected_application[key]) && typeof props.selected_application[key] !== 'function')
                                                        return <ApplicationMiscFieldProperties application={props.selected_application} forceUpdate={forceUpdate} field={{name:key, value:props.selected_application[key]}}/>
                                                })
                                            }
                                        </StyledScrollbar>
                                    </SidebarBlockLayout>
                                </>)
                    }],
                },
                {
                    tabs: [
                        {id: "old", title:"Old Properties", content:
                                <div>
                                <Add id="ch_group" size={"medium"} onClick={handle_add_item} color='white'/>
                                <FieldsContext.Consumer>
                                    {(context) => {
                                        debugger;
                                        return( <>
                                            {context.ch_group ?
                                                <InputField name="ch_group" compact label="Channel Group Name" onKeyDown={handle_add_item_done}/>:null
                                            }
                                        </>)
                                    }}
                                </FieldsContext.Consumer>
                                <StyledScrollbar>
                                    {
                                        props.selected_application.channel_groups.map((group)=>{
                                            return(
                                                <PlotChannelGroupProperties application={props.selected_application} forceUpdate={forceUpdate} group={group}/>
                                            )
                                        })
                                    }
                                </StyledScrollbar>
                            </div>
                        }
                    ],
                }
            ]
        }
    };

    if(!settings.current_application)
        return <></>;

    return (
        <FieldsContext.Provider value={new_fields}>
            <DockLayout defaultLayout={default_layout} style={{position: 'absolute', left: 10, top: 10, right: 10, bottom: 10}}/>
        </FieldsContext.Provider>

    );
};

export default ApplicationEditSidebar;
