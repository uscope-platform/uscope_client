import React from 'react';
import styled from 'styled-components';
import Label from "./Label";

const InnerInput = styled.input`
height: 2rem;
border-radius: 5px;
border-width: 0;
width: auto;
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
display: grid;
grid-template-columns:  ${props => props.inline ? "1fr 1fr" : "1fr"};
grid-auto-rows: auto;
justify-content: ${props => props.inline ? "space-between" : "start"};
align-items: center;
flex-flow: wrap;
`



let  InputField = props =>{
    if(props.compact){
        return (
            <InnerInput
                id={props.ID}
                name={props.name}
                type={(props.type)?props.type:"text"}
                placeholder={props.label}
                disabled = {(props.disabled)? "disabled" : ""}
                onChange={e => {if(props.onChange) props.onChange(e)}}
                onKeyDown={e => {if(props.onKeyDown) props.onKeyDown(e)}}
                defaultValue={props.defaultValue}
                value={props.value?props.value:undefined}
            />
        );
    } else if(props.description){
        return (
            <Wrapper>
                <Label inline={props.inline}>{props.label}</Label>
                <InnerInput
                    name={props.name}
                    id={props.ID}
                    type={(props.type)?props.type:"text"}
                    disabled = {(props.disabled)? "disabled" : ""}
                    onChange={e => {if(props.onChange) props.onChange(e)}}
                    onKeyDown={e => {if(props.onKeyDown) props.onKeyDown(e)}}
                    defaultValue={props.defaultValue}
                    value={props.value?props.value:undefined}
                />
                <InputDescription>{props.description}</InputDescription>
            </Wrapper>
        );
    } else{
        return (
            <Wrapper inline={props.inline}>
                <Label inline={props.inline}>{props.label}</Label>
                <InnerInput

                    name={props.name}
                    id={props.ID}
                    type={(props.type)?props.type:"text"}
                    disabled = {(props.disabled)? "disabled" : ""}
                    onChange={e => {if(props.onChange) props.onChange(e)}}
                    onKeyDown={e => {if(props.onKeyDown) props.onKeyDown(e)}}
                    defaultValue={props.defaultValue}
                    value={props.value?props.value:undefined}
                />
            </Wrapper>
        );
    }

};

export default InputField;
