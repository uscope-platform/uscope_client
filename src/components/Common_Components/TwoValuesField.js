import React from 'react';

import {InputField} from "../UI_elements";
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


const DualWrapper = styled.div`
    display: grid;
    grid-template-columns: repeat(2, auto);
    grid-gap: 1rem;
    align-items: start;
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
                <InputField description={props.field_descriptions[0]} ID={props.ID} name={props.register_name+'.1'} label={props.field_names[0]}/>
                <InputField description={props.field_descriptions[1]} ID={props.ID} name={props.register_name+'.2'} label={props.field_names[1]}/>
                <Edit color='white' onClick={localEditHandler} />
                <Trash color='white' onClick={localRemoveHandler}/>
            </LayoutWrapper>
        );
    } else{
        return(
            <DualWrapper>
                <InputField description={props.field_descriptions[0]} value={props.value[0]} ID={props.ID} name={props.register_name+'.1'} label={props.field_names[0]}/>
                <InputField description={props.field_descriptions[1]} value={props.value[1]} ID={props.ID} name={props.register_name+'.2'} label={props.field_names[1]}/>
            </DualWrapper>
        );
    }



};

export default TwoValuesField;
