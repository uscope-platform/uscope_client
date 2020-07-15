import styled from 'styled-components';
import React from "react";
import Label from "./Label";

const InputCheckbox = styled.input`
border-width: 0;
`

const Wrapper = styled.div`
display: flex;
align-items: center;
flex-flow: wrap;
`


let  Checkbox = props =>{

    return(
        <Wrapper>
            <Label inline={props.inline}>{props.label}</Label>
            <InputCheckbox
                name={props.name}
                checked={props.value?"true":""}
                type="checkbox"
                onChange={e => props.onChange(e)}
                style={props.style}
            />
        </Wrapper>
    );
};

export default Checkbox;
