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

import React, {useCallback, useEffect} from 'react';
import {Image} from "../UI_elements";

import {useDispatch, useSelector} from "react-redux";
import RegisterInputForm from "./RegisterInputForm";
import styled from "styled-components";
import {setSetting} from "../../redux/Actions/SettingsActions";


const LayoutWrapper = styled.div`
    display: grid;
    grid-template-columns: 1fr 2fr;
    grid-auto-rows: minmax(0, 10rem);
    grid-gap: 1.5rem;
    margin-top: 1rem;
    margin-right: 1rem;
    margin-left: 1rem;

`

let  RegisterTab = props =>{
    const peripherals = useSelector(state => state.peripherals);
    const settings = useSelector(state => state.settings);
    const registerValues = useSelector(state => state.registerValues);
    const dispatch = useCallback(useDispatch(), []);



    useEffect(()=>{
        dispatch(setSetting(["current_view_requires_sidebar", false]));
        return () =>{
            dispatch(setSetting(["current_view_requires_sidebar", true]));
        }
    }, [dispatch]);

    return(
        <LayoutWrapper>
            <Image src={settings.server_url + peripherals[props.content.spec_id].image} alt='Peripheral diagram' fluid/>
            <RegisterInputForm registers={peripherals[props.content.spec_id].registers}
                               values={registerValues[props.content.spec_id]}
                               content={registerValues[props.content.spec_id]}
                               parent_peripheral={props.content.spec_id}
            />
        </LayoutWrapper>
    );
};

export default RegisterTab;