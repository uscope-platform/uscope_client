import React, {useState} from 'react';

import styled from "styled-components";

import {useSelector} from "react-redux";

import BlockTitle from "../../UI_elements/BlockTitle";

import SidebarBlockTitleLayout from "../../UI_elements/Layouts/SidebarBlockTitleLayout";
import SidebarContentLayout from "../../UI_elements/Layouts/SidebarContentLayout";
import StyledScrollbar from "../../UI_elements/StyledScrollbar";
import PlotChannelProperties from "../../UI_elements/SidebarComponents/PlotChannelProperties";
import SidebarBlockLayout from "../../UI_elements/Layouts/SidebarBlockLayout";
import InitialRegisterValue from "../../UI_elements/SidebarComponents/InitialRegisterValueProperties";
import MacroProperties from "../../UI_elements/SidebarComponents/MacroProperties";
import ParameterProperties from "../../UI_elements/SidebarComponents/ParameterProperties";
import ApplicationPeripheralProperties from "../../UI_elements/SidebarComponents/ApplicationPeripheralProperties";
import {Add} from "grommet-icons";
import InputField from "../../UI_elements/InputField";

let  ApplicationEditSidebar = props =>{
    const settings = useSelector(state => state.settings);
    const applications = useSelector(state => state.applications)

    const [new_channel, set_new_channel] = useState(false);
    const [new_irv, set_new_irv] = useState(false);
    const [new_macro, set_new_macro] = useState(false);
    const [new_parameter, set_new_parameter] = useState(false);
    const [new_peripheral, set_new_peripheral] = useState(false);

    let handle_add_item_done = (event) =>{
        let edit = {};
        if(event.key==="Enter"|| event.key ==="Tab"){
            switch (event.target.name) {
                case "channel":
                    edit = {application:settings.current_application, action:"add_channel"};
                    set_new_channel(false);
                    break;
                case "irv":
                    edit = {application:settings.current_application, action:"add_irv"};
                    set_new_irv(false);
                    break;
                case"macro":
                    edit = {application:settings.current_application, action:"add_macro"};
                    set_new_macro(false);
                    break;
                case"parameter":
                    edit = {application:settings.current_application, action:"add_parameter"};
                    set_new_parameter(false);
                    break;
                case"peripheral":
                    edit = {application:settings.current_application, action:"add_peripheral"};
                    set_new_parameter(false);
                    break;
                default:
                    return;
            }
            settings.server.app_proxy.edit_application(edit);
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
            default:
                return;
        }
    }



    if(!settings.current_application)
        return <></>;

    return (
        <SidebarContentLayout application>
            <BlockTitle>{applications[settings.current_application].application_name}</BlockTitle>
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
                        applications[settings.current_application].tabs.map((peripheral)=>{
                            return(
                                <ApplicationPeripheralProperties application={settings.current_application} peripheral={peripheral}/>
                            )
                        })
                    }
                </StyledScrollbar>
            </SidebarBlockLayout>
        </SidebarContentLayout>
    );
};

export default ApplicationEditSidebar;
