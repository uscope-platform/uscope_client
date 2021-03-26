import React, {useState} from "react";
import {Label} from "../Label";
import styled from "styled-components";
import {CaretDown, CaretUp} from "grommet-icons";
import {InputField} from "../InputField";
import {Checkbox} from "../checkbox";
import {Radio} from "../Radio";
import {TextArea} from "../TextArea";
import {useSelector} from "react-redux";
import {Button} from "../Button";
import {SidebarCollapsableContentLayout} from "../Layouts/SidebarCollapsableContentLayout";
import {SidebarCollapsableNameLayout} from  "../Layouts/SidebarCollapsableNameLayout";

const ChoicesWrapper = styled.div`
    display: grid;
    grid-template-columns: repeat(2, auto);
    grid-gap: 0.3rem;
    justify-content: space-between;
    align-items: start;
`

export let  RegisterProperties = props =>{

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
        switch (event.target.name) {
            case "type":
                edit = {peripheral:props.peripheral, register:props.register.register_name, field:"register_format", value:event.target.id, action:"edit_register"};
                break;
            case "direction_read":
                if(event.target.checked){
                    if(props.register.direction.includes("W")){
                        value = "R/W"
                    }else{
                        value = "R"
                    }
                } else{
                    if(props.register.direction.includes("W")){
                        value = "W"
                    }else{
                        value = ""
                    }
                }
                edit = {peripheral:props.peripheral, register:props.register.register_name, field:"direction", value:value,action:"edit_register"};
                break;
            case "direction_write":
                if(event.target.checked){
                    if(props.register.direction.includes("R")){
                        value = "R/W"
                    }else{
                        value = "W"
                    }
                } else{
                    if(props.register.direction.includes("R")){
                        value = "R"
                    }else{
                        value = ""
                    }
                }

                edit = {peripheral:props.peripheral, register:props.register.register_name, field:"direction", value:value,action:"edit_register"};
                break;
            default:
                return;
        }
        settings.server.creator_proxy.edit_peripheral(edit);
    }

    let handleonKeyDown = (event) =>{
        let edit = {}
        if(event.key==="Enter"|| event.key ==="Tab"){
            switch (event.target.name) {
                case "ID":
                case "offset":
                case "description":
                    edit = {peripheral:props.peripheral, register:props.register.register_name, field:event.target.name, value:event.target.value,action:"edit_register"};
                    settings.server.creator_proxy.edit_peripheral(edit);
                    break;
                case "field_descriptions":
                case "field_names":
                    if(event.shiftKey)
                        event.preventDefault();
                    else if(event.key!=="Tab")
                        return;
                    edit = {peripheral:props.peripheral, register:props.register.register_name, field:event.target.name, value:event.target.value.split('\n'),action:"edit_register"};
                    settings.server.creator_proxy.edit_peripheral(edit);
                    break;
                default:
                    return;
            }
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
                    <InputField inline name='ID' defaultValue={props.register.ID} onKeyDown={handleonKeyDown} label="Register ID"/>
                    <InputField inline name='offset' defaultValue={props.register.offset} onKeyDown={handleonKeyDown} label="Address offset"/>
                    <InputField inline name='description' defaultValue={props.register.description} onKeyDown={handleonKeyDown} label="Description"/>
                    <ChoicesWrapper>
                        <Label>Register access capabilities</Label>
                        <div>
                            <Checkbox name='direction_read' value={props.register.direction.includes("R")} onChange={handleChange} label="Read"/>
                            <Checkbox name='direction_write' value={props.register.direction.includes("W")} onChange={handleChange} label="Write"/>
                        </div>
                    </ChoicesWrapper>
                    <ChoicesWrapper>
                        <Label>Register type</Label>
                        <div>
                            <Radio name="type" value={props.register.register_format !== "words"} onChange={handleChange} label="single" id='single'/>
                            <Radio name="type" value={props.register.register_format === "words"} onChange={handleChange} label="words" id='words'/>
                        </div>
                    </ChoicesWrapper>
                    <TextArea disabled={props.register.register_format !== "words"}  defaultValue={props.register.field_names && props.register.field_names.join('\n')} name="field_names" label="Field Names" rows={2}  onKeyDown={handleonKeyDown}/>
                    <TextArea disabled={props.register.register_format !== "words"}  defaultValue={props.register.field_names && props.register.field_descriptions.join('\n')} name="field_descriptions" label="Field Descriptions" rows={2}  onKeyDown={handleonKeyDown}/>
                    <Button onClick={handleRemoveRegister} >Remove</Button>
                </SidebarCollapsableContentLayout>
            )
        return null;
    }

    return(
        <>
            <SidebarCollapsableNameLayout>
                {edit_name
                    ? <InputField compact name="edit_name" defaultValue={props.register.register_name} onKeyDown={handleEditNameChange} label={props.register.register_name}/>
                    : <Label onDoubleClick={handleEditName}>{props.register.register_name}</Label>
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