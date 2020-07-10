import styled from 'styled-components';
import React from "react";

import Label from "./Label";

const InputChoice = styled.input`
`

const Wrapper = styled.div`
 display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
`


let  FileChoice = props =>{

    return(
        <Wrapper>
            <Label inline={props.inline}>{props.label}</Label>
            <InputChoice
                name={props.name}
                type="file"
                onChange={e => props.onChange(e)}
            />
        </Wrapper>
    );
};

export default FileChoice;
