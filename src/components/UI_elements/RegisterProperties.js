import React, {useState} from "react";
import Label from "./Label";
import styled from "styled-components";
import {CaretDown} from "grommet-icons";
import {CaretUp} from "grommet-icons";
import InputField from "./InputField";
import Checkbox from "./checkbox";
import Radio from "./Radio";
import TextArea from "./TextArea";

const RegNameWrapper = styled.div`
  height: 1em;
`
const RegContentLayout = styled.div`
  margin-left: 1em;
  margin-top: 0.5em;
`

const RegPropertiesLayout = styled.div`
 display: flex;
 flex-direction: column;
`

const ChoicesWrapper = styled.div`
    display: grid;
    grid-template-columns: repeat(2, auto);
    grid-gap: 0.3rem;
    justify-content: space-between;
    align-items: start;
`

let  RegisterProperties = props =>{
    const [is_open, set_is_open] = useState(false);
    const [edit_name, set_edit_name] = useState(false);
    const [words_register, set_words_register] = useState(false);


    let handleOpen = ()=>{
        set_is_open(true);
    }

    let handleEditName = () => {
        set_edit_name(true);
    }

    let handleEditNameChange = (event) => {
        if(event.key==="Enter"){
            let NewRegName = event.target.value;
            set_edit_name(false);
        }else if(event.key ==="Escape"){
            set_edit_name(false);
        }
    }

    let handleClose = ()=>{
        set_is_open(false);
    }

    let handleChange = (event) =>{
        if(event.target.name==="reg_type"){
            set_words_register(event.target.id==="words");
        }
    }

    let renderContent = (props) =>{
        if(is_open)
            return(
                <RegContentLayout>
                    <InputField inline name='reg_ID' value={props.register.ID} onChange={handleChange} label="Register ID"/>
                    <InputField inline name='reg_offset' value={props.register.offset} onChange={handleChange} label="Address offset"/>
                    <InputField inline name='reg_description' value={props.register.description} onChange={handleChange} label="Description"/>
                    <ChoicesWrapper>
                        <Label>Register access capabilities</Label>
                        <div>
                            <Checkbox name='reg_direction_read' value={props.register.direction.includes("R")} onChange={handleChange} label="Read"/>
                            <Checkbox name='reg_direction_write' value={props.register.direction.includes("W")} onChange={handleChange} label="Write"/>
                        </div>
                    </ChoicesWrapper>
                    <ChoicesWrapper>
                        <Label>Register type</Label>
                        <div>
                            <Radio name="reg_type" value={props.register.register_format !== "words"} onChange={handleChange} label="single" id='single'/>
                            <Radio name="reg_type" value={props.register.register_format === "words"} onChange={handleChange} label="words" id='words'/>
                        </div>
                    </ChoicesWrapper>
                    <TextArea disabled={props.register.register_format !== "words"}  value={props.register.field_names.join('\n')} name="field_names" label="Field Names" rows={2}  onChange={handleChange}/>
                    <TextArea disabled={props.register.register_format !== "words"}  value={props.register.field_descriptions.join('\n')} name="field_desc" label="Field Descriptions" rows={2}  onChange={handleChange}/>
                </RegContentLayout>
            )
        return null;
    }

    return(
        <RegPropertiesLayout>
            <RegNameWrapper>
                {edit_name
                    ? <InputField compact name="edit_name" value={props.register.register_name} onKeyDown={handleEditNameChange} label={props.register.register_name}/>
                    : <Label onDoubleClick={handleEditName}>{props.register.register_name}</Label>
                }

                {is_open
                    ? <CaretUp size={"small"} onClick={handleClose}/>
                    : <CaretDown size={"small"} onClick={handleOpen}/>
                }
            </RegNameWrapper>
            {
                renderContent(props)
            }
        </RegPropertiesLayout>
    );
};

export default RegisterProperties;
