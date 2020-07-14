import React from 'react';

import InputField from "../UI_elements/InputField";
import {Edit, Trash} from "grommet-icons";
import styled from "styled-components";


const LayoutWrapper = styled.div`
    display: grid;
    grid-template-columns: auto auto auto;
    grid-column-gap: 1em;
    justify-content: start;
    grid-auto-rows: minmax(1em, auto);
    align-items: center;
`


let SingleValueField = props => {


    let localRemoveHandler = () =>{
        props.handle_remove(props.name);
    };

    let localEditHandler = () =>{
        props.handle_edit(props.regID);
    };


    if(props.preview_only){
        return(
            <LayoutWrapper>
                <InputField description={props.description} ID={props.ID} name={props.name} label={props.name}/>
                <Edit color='white' onClick={localEditHandler} />
                <Trash color='white' onClick={localRemoveHandler}/>
            </LayoutWrapper>
        );
    } else{
        return(
            <InputField description={props.description} ID={props.ID} name={props.name} label={props.name}/>
        );
    }
};

export default SingleValueField;
