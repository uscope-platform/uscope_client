import styled from 'styled-components';
import React from "react";

import {Label} from "./Label";

const InputRadio = styled.input`
height: 1rem;
`

const Wrapper = styled.div`
 display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
`


export let  Radio = props =>{

    return(
        <Wrapper>
            <InputRadio
                name={props.name}
                id={props.id}
                type="radio"
                checked = {props.value}
                onChange={e => props.onChange(e)}/>
            <Label inline={props.inline}>{props.label}</Label>
        </Wrapper>
    );
};
