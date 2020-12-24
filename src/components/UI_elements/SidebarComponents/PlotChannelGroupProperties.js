import React, {useState} from "react";
import {useSelector} from "react-redux";
import {Label} from "../Label";
import {CaretDown, CaretUp} from "grommet-icons";
import {InputField} from "../InputField";


import {Button} from "../Button";
import {Checkbox, MultiSelect, SidebarCollapsableContentLayout, SidebarCollapsableNameLayout} from "..";

export let  PlotChannelGroupProperties = props =>{

    const settings = useSelector(state => state.settings);
    const channels = useSelector(state => state.applications[props.application].channels)

    const [is_open, set_is_open] = useState(false);
    const [channels_list, set_channels_list] = useState([]);
    const [edit_name, set_edit_name] = useState(false);

    let options = channels.map((ch)=>{
        return {label:ch.name, value:ch.id}
    });

    let handleOpen = ()=>{
        set_is_open(true);
    }

    let handleEditName = () => {
        set_edit_name(true);
    }

    let handleEditNameChange = (event) => {
        if(event.key==="Enter"){
            let edit = {application:props.application, group:props.group.group_name, field:event.target.name, value:event.target.value, action:"edit_channel_group"};
            settings.server.app_proxy.edit_application(edit);
            set_edit_name(false);
        }else if(event.key ==="Escape"){
            set_edit_name(false);
        }
    }

    let handleChangeDefault = (event)=>{
        let edit = {application:props.application, group:props.group.group_name, field:event.target.name, value:event.target.checked, action:"edit_channel_group"};
        settings.server.app_proxy.edit_application(edit);
    }

    let handleClose = ()=>{
        set_is_open(false);
    }

    let handleChange = (event)=>{
        if(event.length<=6){
            set_channels_list(event);
            let edit = {application:props.application, group:props.group.group_name, field:"channels", value:event, action:"edit_channel_group"};
            settings.server.app_proxy.edit_application(edit);
        }

    }

    let handleonKeyDown = (event) =>{
        let edit = {}
        if(event.key==="Enter"|| event.key ==="Tab"){
            edit = {application:props.application, group:props.group.group_name, field:event.target.name, value:event.target.value, action:"edit_channel_group"};
            settings.server.app_proxy.edit_application(edit);
        }
    }

    let handleRemoveRegister= (event) =>{
        let edit = {application:props.application, group:props.group.group_name, action:"remove_channel_group"};
        settings.server.app_proxy.edit_application(edit);
    }

    let renderChannelContent = (props) =>{
        if(is_open) {
            let is_default = props.group.default;
            return (
                <SidebarCollapsableContentLayout>
                    <InputField name='group_id' defaultValue={props.group.group_id} onKeyDown={handleonKeyDown}
                                label="ID"/>
                    <MultiSelect onChange={handleChange} value={channels_list} options={options} label="Content"/>
                    <Checkbox name='default' value={is_default} onChange={handleChangeDefault} label="Default group"/>

                    <Button onClick={handleRemoveRegister}>Remove</Button>
                </SidebarCollapsableContentLayout>
            )
        }
        return null;
    }

    return(
        <>
            <SidebarCollapsableNameLayout>
                {edit_name
                    ? <InputField compact name="group_name" defaultValue={props.group.group_name} onKeyDown={handleEditNameChange} label={props.group.group_name}/>
                    : <Label onDoubleClick={handleEditName}>{props.group.group_name}</Label>
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