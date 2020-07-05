import React from 'react';

import InputField from "../UI_elements/InputField";
import {Edit, Trash} from "grommet-icons";
import styled from "styled-components";

const LayoutWrapper = styled.div`
    display: grid;
    grid-template-columns: auto auto auto auto;
    grid-column-gap: 1em;
    justify-content: start;
    grid-auto-rows: minmax(1em, auto);
    align-items: center;
`

let TwoValuesField = props => {

    let localRemoveHandler = () =>{
        props.handle_remove(props.register_name);
    };

    let localEditHandler = () =>{
        props.handle_edit(props.regID);
    };


    if(props.preview_only){
        return(
            <LayoutWrapper>
                <InputField description={props.field_descriptions[0]} name={props.register_name+'.1'} label={props.field_names[0]}/>
                <InputField description={props.field_descriptions[1]} name={props.register_name+'.2'} label={props.field_names[1]}/>
                <Edit color='white' onClick={localEditHandler} />
                <Trash color='white' onClick={localRemoveHandler}/>
            </LayoutWrapper>
        );
    } else{
        return(
            <>
                <InputField description={props.field_descriptions[0]} name={props.register_name+'.1'} label={props.field_names[0]}/>
                <InputField description={props.field_descriptions[1]} name={props.register_name+'.2'} label={props.field_names[1]}/>
            </>
        );
    }



};

export default TwoValuesField;
