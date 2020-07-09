import Label from "./Label";
import React from "react";
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



class RegisterProperties extends React.Component {
    constructor(props) {
        super(props);
        this.state = {is_open:false, edit_name:false};
    }

    handleOpen = ()=>{
        this.setState({is_open:true});
    }

    handleEditName = () => {
        this.setState({edit_name:true});
    }

    handleEditNameChange = (event) => {
        if(event.key==="Enter"){
            let NewRegName = event.target.value;
            this.setState({edit_name:false});
        }else if(event.key ==="Escape"){
            this.setState({edit_name:false});
        }
    }

    handleClose = ()=>{
        this.setState({is_open:false});
    }



    renderContent = () =>{
        if(this.state.is_open)
            return(
                <RegContentLayout>
                    <InputField inline name='reg_ID' onChange={this.handleChange} label="Register ID"/>
                    <InputField inline name='reg_offset' onChange={this.handleChange} label="Address offset"/>
                    <InputField inline name='reg_description' onChange={this.handleChange} label="Description"/>
                    <ChoicesWrapper>
                        <Label>Register access capabilities</Label>
                        <div>
                            <Checkbox name='reg_direction_read' onChange={this.handleChange} label="Read"/>
                            <Checkbox name='reg_direction_write' onChange={this.handleChange} label="Write"/>
                        </div>
                    </ChoicesWrapper>
                    <ChoicesWrapper>
                        <Label>Register type</Label>
                        <div>
                            <Radio name="reg_type" value={!this.state.enable_word_fields} onChange={this.handleChange} label="single" id='single'/>
                            <Radio name="reg_type" value={this.state.enable_word_fields} onChange={this.handleChange} label="words" id='words'/>
                        </div>
                    </ChoicesWrapper>
                    <TextArea disabled={!this.state.enable_word_fields} name="field_names" label="Field Names" rows={2}  onChange={this.handleChange}/>
                    <TextArea disabled={!this.state.enable_word_fields} name="field_desc" label="Field Descriptions" rows={2}  onChange={this.handleChange}/>
                </RegContentLayout>
            )
        return null;
    }

    render() {
        return (
            <RegPropertiesLayout>
                <RegNameWrapper>
                    {this.state.edit_name
                        ? <InputField compact name="edit_name" onKeyDown={this.handleEditNameChange} label={this.props.register.register_name}/>
                        : <Label onDoubleClick={this.handleEditName}>{this.props.register.register_name}</Label>
                    }

                    {this.state.is_open
                        ? <CaretUp size={"small"} onClick={this.handleClose}/>
                        : <CaretDown size={"small"} onClick={this.handleOpen}/>
                    }
                </RegNameWrapper>
                {
                    this.renderContent()
                }
            </RegPropertiesLayout>
        );

    }
}


export default RegisterProperties;