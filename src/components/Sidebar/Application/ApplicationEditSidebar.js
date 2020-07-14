import React from 'react';

import styled from "styled-components";

import {useSelector} from "react-redux";

import BlockTitle from "../../UI_elements/BlockTitle";

import InputField from "../../UI_elements/InputField";
import SidebarContentLayout from "../../UI_elements/Layouts/SidebarContentLayout";
import StyledScrollbar from "../../UI_elements/StyledScrollbar";
import PlotChannelProperties from "../../UI_elements/SidebarComponents/PlotChannelProperties";
import SidebarBlockLayout from "../../UI_elements/Layouts/SidebarBlockLayout";
import InitialRegisterValue from "../../UI_elements/SidebarComponents/InitialRegisterValueProperties";
import MacroProperties from "../../UI_elements/SidebarComponents/MacroProperties";
import ParameterProperties from "../../UI_elements/SidebarComponents/ParameterProperties";
import ApplicationPeripheralProperties from "../../UI_elements/SidebarComponents/ApplicationPeripheralProperties";

const TitleLayout = styled.div`
  margin-left: auto;
  margin-right: auto;
`

let  ApplicationEditSidebar = props =>{
    const settings = useSelector(state => state.settings);
    const applications = useSelector(state => state.applications)

    if(!settings.current_application)
        return <></>;

    return (
        <SidebarContentLayout application>
            <BlockTitle>{applications[settings.current_application].application_name}</BlockTitle>
            <SidebarBlockLayout>
                    <label style={{fontSize:'20px',fontWeight:600}}>{"Channels"}</label>
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
                <label style={{fontSize:'20px',fontWeight:600}}>{"Initial Register Values"}</label>
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
                <label style={{fontSize:'20px',fontWeight:600}}>{"Macro"}</label>
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
                <label style={{fontSize:'20px',fontWeight:600}}>{"Parameters"}</label>
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
                <label style={{fontSize:'20px',fontWeight:600}}>{"Peripherals"}</label>
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
