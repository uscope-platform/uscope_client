import React, {useState} from "react";
import {useSelector} from "react-redux";
import {Label} from "../Label";
import {CaretDown, CaretUp} from "grommet-icons";
import {InputField} from "../InputField";
import {Checkbox} from "../checkbox";

import {Button} from "../Button";
import {SidebarCollapsableContentLayout} from "../Layouts/SidebarCollapsableContentLayout";
import {SidebarCollapsableNameLayout} from  "../Layouts/SidebarCollapsableNameLayout";

export let  ParameterProperties = props =>{

    const settings = useSelector(state => state.settings);

    const [is_open, set_is_open] = useState(false);
    const [edit_name, set_edit_name] = useState(false);



    let handleOpen = ()=>{
        set_is_open(true);
    }

    let handleEditName = () => {
        set_edit_name(true);
    }

    let handleEditNameChange = (event) => {
        if(event.key==="Enter"){
            let edit = {application:props.application, parameter:props.parameter.parameter_id, field:event.target.name, value:event.target.value, action:"edit_parameter"};
            settings.server.app_proxy.edit_application(edit);
            set_edit_name(false);
        }else if(event.key ==="Escape"){
            set_edit_name(false);
        }
    }

    let handleClose = ()=>{
        set_is_open(false);
    }

    let handleChange = (event)=>{
        let edit = {application:props.application, parameter:props.parameter.parameter_id, field:event.target.name, value:event.target.checked, action:"edit_parameter"};
        settings.server.app_proxy.edit_application(edit);
    }

    let handleonKeyDown = (event) =>{
        let edit = {}
        if(event.key==="Enter"|| event.key ==="Tab"){
            edit = {application:props.application, parameter:props.parameter.parameter_id, field:event.target.name, value:event.target.value, action:"edit_parameter"};
            settings.server.app_proxy.edit_application(edit);
        }
    }

    let handleRemoveRegister= (event) =>{
        let edit = {application:props.application, parameter:props.parameter.parameter_id, action:"remove_parameter"};
        settings.server.app_proxy.edit_application(edit);
    }

    let renderChannelContent = (props) =>{
        if(is_open)
            return(
                <SidebarCollapsableContentLayout>
                    <InputField inline name='parameter_id' defaultValue={props.parameter.parameter_id} onKeyDown={handleonKeyDown} label="Parameter ID"/>
                    <InputField inline name='trigger' defaultValue={props.parameter.trigger} onKeyDown={handleonKeyDown} label="Trigger"/>
                    <InputField inline name='value' defaultValue={props.parameter.value} onKeyDown={handleonKeyDown} label="Value"/>
                    <Checkbox name='visible' value={props.parameter.visible} onChange={handleChange} label="Visible"/>
                    <Button onClick={handleRemoveRegister} >Remove</Button>
                </SidebarCollapsableContentLayout>
            )
        return null;
    }

    return(
        <>
            <SidebarCollapsableNameLayout>
                {edit_name
                    ? <InputField compact name="parameter_name" defaultValue={props.parameter.parameter_name} onKeyDown={handleEditNameChange} label={props.parameter.parameter_name}/>
                    : <Label onDoubleClick={handleEditName}>{props.parameter.parameter_name}</Label>
                }

                {is_open
                    ? <CaretUp size={"small"} onClick={handleClose} color='white'/>
                    : <CaretDown size={"small"} onClick={handleOpen} color='white'/>
                }
            </SidebarCollapsableNameLayout>
            {
                renderChannelContent(props)
            }
        </>
    );
};