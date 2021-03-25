import styled from 'styled-components';
import {Label} from "./Label";
import React from "react";



export const Select = styled.select`
  width: fit-content;
  height: 2rem;
  border-radius: 5px;
  min-width: 4em;
  option {
    display: flex;
    justify-content: center;
    min-height: 20px;
  }
`;


const SelectWrapper = styled.div`
    display: grid;
    grid-template-columns: repeat(2, auto);
    grid-gap: 0.3rem;
    justify-content: space-between;
    align-items: start;
`

export let  SelectField = props =>{
    return(
        <SelectWrapper>
            <Label>{props.label}</Label>
            <Select name={props.name} defaultValue={props.defaultValue} onChange={props.onChange}>
                <option value={props.name} hidden>{props.placeholder}</option>
                {
                    props.options.map((name,i) => (
                        <option key={i} >{name}</option>
                    ))
                }
            </Select>
        </SelectWrapper>
    );
};

