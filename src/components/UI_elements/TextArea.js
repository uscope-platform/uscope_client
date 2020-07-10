import styled from "styled-components";
import React from "react";
import Label from "./Label";

const InputTextArea = styled.textarea`
  border-radius: 5px;
`

const Wrapper = styled.div`
 display: inline-flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
`


let  TextArea = props =>{

    return(
        <Wrapper>
            <Label>{props.label}</Label>
            <InputTextArea
                rows={props.rows}
                name={props.name}
                value={props.value}
                defaultValue={props.defaultValue}
                disabled = {(props.disabled)? "disabled" : ""}
                onChange={e => {if(props.onChange) props.onChange(e)}}
                onKeyDown={e => {if(props.onKeyDown) props.onKeyDown(e)}}
            />
        </Wrapper>
    );
};

export default TextArea;
