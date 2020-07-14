import React, {useState} from "react";
import {useSelector} from "react-redux";
import Label from "../Label";
import {CaretDown, CaretUp} from "grommet-icons";
import InputField from "../InputField";
import Checkbox from "../checkbox";

import Button from "../Button";
import SidebarCollapsableNameLayout from "../Layouts/SidebarCollapsableNameLayout";
import SidebarCollapsableContentLayout from "../Layouts/SidebarCollapsableContentLayout";

let  InitialRegisterValue = props =>{

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
            let edit = {application:props.application, address:props.irv.address, field:event.target.name, value:event.target.value, action:"edit_irv"};
            settings.server.app_proxy.edit_application(edit);
            set_edit_name(false);
        }else if(event.key ==="Escape"){
            set_edit_name(false);
        }
    }

    let handleClose = ()=>{
        set_is_open(false);
    }

    let handleonKeyDown = (event) =>{
        let edit = {}
        if(event.key==="Enter"|| event.key ==="Tab"){
            edit = {application:props.application, address:props.irv.address, field:event.target.name, value:event.target.value, action:"edit_irv"};
            settings.server.app_proxy.edit_application(edit);
        }
    }

    let handleRemoveRegister= (event) =>{
        let edit = {application:props.application, address:props.irv.address, action:"remove_irv"};
        settings.server.app_proxy.edit_application(edit);
    }

    let renderChannelContent = (props) =>{
        if(is_open)
            return(
                <SidebarCollapsableContentLayout>
                    <InputField inline name='value' defaultValue={props.irv.value} onKeyDown={handleonKeyDown} label="Value"/>
                    <Button onClick={handleRemoveRegister} >Remove</Button>
                </SidebarCollapsableContentLayout>
            )
        return null;
    }

    return(
        <>
            <SidebarCollapsableNameLayout>
                {edit_name
                    ? <InputField compact name="address" defaultValue={props.irv.address} onKeyDown={handleEditNameChange} label={props.irv.address}/>
                    : <Label onDoubleClick={handleEditName}>{props.irv.address}</Label>
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

export default InitialRegisterValue;
