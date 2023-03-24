// Copyright 2021 University of Nottingham Ningbo China
// Author: Filippo Savi <filssavi@gmail.com>
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import React from 'react';

import {ColorTheme, InputField} from "../UI_elements";
import {MdEdit, MdDelete} from "react-icons/md";
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
                <MdEdit color={ColorTheme.icons_color} onClick={localEditHandler} />
                <MdDelete color={ColorTheme.icons_color} onClick={localRemoveHandler}/>
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
