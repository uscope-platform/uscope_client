import styled from 'styled-components';
import React from "react";
import Label from "./Label";

const InputCheckbox = styled.input`
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
            />
        </Wrapper>
    );
};

export default Checkbox;
