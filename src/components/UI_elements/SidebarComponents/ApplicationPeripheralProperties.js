import React, {useState} from "react";
import Label from "../Label";
import styled from "styled-components";
import {CaretDown, CaretUp} from "grommet-icons";
import InputField from "../InputField";
import Checkbox from "../checkbox";
import Radio from "../Radio";
import TextArea from "../TextArea";
import {useSelector} from "react-redux";
import Button from "../Button";
import SidebarCollapsableNameLayout from "../Layouts/SidebarCollapsableNameLayout";
import SidebarCollapsableContentLayout from "../Layouts/SidebarCollapsableContentLayout";

const ChoicesWrapper = styled.div`
    display: grid;
    grid-template-columns: repeat(2, auto);
    grid-gap: 0.3rem;
    justify-content: space-between;
    align-items: start;
`

let  ApplicationPeripheralProperties = props =>{

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
            let edit = {peripheral:props.peripheral, register:props.register.register_name, field:"register_name", value:event.target.value,action:"edit_register"};
            settings.server.creator_proxy.edit_peripheral(edit);
            set_edit_name(false);
        }else if(event.key ==="Escape"){
            set_edit_name(false);
        }
    }

    let handleClose = ()=>{
        set_is_open(false);
    }

    let handleChange = (event)=>{
        let edit ={};
        let value = ""

        settings.server.creator_proxy.edit_peripheral(edit);
    }

    let handleonKeyDown = (event) =>{
        let edit = {}
        if(event.key==="Enter"|| event.key ==="Tab"){

        }
    }

    let handleRemoveRegister= (event) =>{
        let edit = {peripheral:props.peripheral, register:props.register.register_name, action:"remove_register"};
        settings.server.creator_proxy.edit_peripheral(edit);
    }

    let renderContent = (props) =>{
        if(is_open)
            return(
                <SidebarCollapsableContentLayout>
                    <InputField inline name='tab_id' defaultValue={props.peripheral.tab_id} onKeyDown={handleonKeyDown} label="peripheral ID"/>
                    <InputField inline name='base_address' defaultValue={props.peripheral.base_address} onKeyDown={handleonKeyDown} label="Base Address"/>
                    <InputField inline name='type' defaultValue={props.peripheral.type} onKeyDown={handleonKeyDown} label="Type"/>
                    <Checkbox name='proxied' value={props.peripheral.proxied} onChange={handleChange} label="Proxied Peripheral"/>
                    <InputField inline name='proxy_address' disabled={!props.peripheral.proxied} defaultValue={props.peripheral.proxy_address} onKeyDown={handleonKeyDown} label="Proxy Address"/>
                    <Checkbox name='user_accessible' value={props.peripheral.user_accessible} onChange={handleChange} label="User Accessible"/>
                    <Button onClick={handleRemoveRegister} >Remove</Button>
                </SidebarCollapsableContentLayout>
            )
        return null;
    }

    return(
        <>
            <SidebarCollapsableNameLayout>
                {edit_name
                    ? <InputField compact name="name" defaultValue={props.peripheral.name} onKeyDown={handleEditNameChange} label={props.peripheral.name}/>
                    : <Label onDoubleClick={handleEditName}>{props.peripheral.name}</Label>
                }

                {is_open
                    ? <CaretUp size={"small"} onClick={handleClose} color='white'/>
                    : <CaretDown size={"small"} onClick={handleOpen} color='white'/>
                }
            </SidebarCollapsableNameLayout>
            {
                renderContent(props)
            }
        </>
    );
};

export default ApplicationPeripheralProperties;
