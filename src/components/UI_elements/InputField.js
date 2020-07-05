import React from 'react';
import styled from 'styled-components';
import Label from "./Label";

const InnerInput = styled.input`
height: 2rem;
border-radius: 5px;
width: auto;
`
const LineBreak = styled.div`
flex-basis: ${props => props.inline ? "0%" : "100%"};
height: 0;
`

const InputDescription = styled.label`
width: fit-content;
font-family: Roboto,Helvetica,Arial,sans-serif;
font-size: 0.7rem;
margin-top: 0.15rem;
margin-left: 0.15rem;
`

const Wrapper = styled.div`
margin: 0 0.2rem;
display: ${props => props.inline ? "flex" : "block"};
justify-content: ${props => props.inline ? "space-between" : "start"};
align-items: center;
flex-flow: wrap;
`



class InputField extends React.Component {
    constructor(props) {
        super(props);
        this.inputRef = React.createRef();
    }
    render() {
        if(this.props.compact){
            return (
                <InnerInput
                    name={this.props.name}
                    type={(this.props.type)?this.props.type:"text"}
                    placeholder={this.props.label}
                    disabled = {(this.props.disabled)? "disabled" : ""}
                    onChange={e => this.props.onChange(e)}
                />
            );
        } else{
            if(this.props.description){
                return (
                    <Wrapper>
                        <Label inline={this.props.inline}>{this.props.label}</Label>
                        <LineBreak inline={this.props.inline}/>
                        <Wrapper>
                            <InnerInput
                                name={this.props.name}
                                type={(this.props.type)?this.props.type:"text"}
                                disabled = {(this.props.disabled)? "disabled" : ""}
                                onChange={e => this.props.onChange(e)}
                            />
                            <LineBreak inline={false}/>
                            <InputDescription>{this.props.description}</InputDescription>
                        </Wrapper>
                    </Wrapper>
                );
            } else{
                return (
                    <Wrapper inline={this.props.inline}>
                        <Label inline={this.props.inline}>{this.props.label}</Label>
                        <LineBreak inline={this.props.inline}/>
                            <InnerInput
                                name={this.props.name}
                                type={(this.props.type)?this.props.type:"text"}
                                disabled = {(this.props.disabled)? "disabled" : ""}
                                onChange={e => {if(this.props.onChange) this.props.onChange(e)}}
                            />
                    </Wrapper>
                );
            }
        }
    }
}


export default InputField;
