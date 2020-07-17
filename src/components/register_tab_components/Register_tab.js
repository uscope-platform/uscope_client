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
            <Image src={settings.server.server_url + peripherals[props.content.peripheral_id].image} alt='Peripheral diagram' fluid/>
            <RegisterInputForm registers={peripherals[props.content.peripheral_id].registers}
                               values={registerValues[props.content.peripheral_id]}
                               content={registerValues[props.content.peripheral_id]}
                               parent_peripheral={props.content.peripheral_id}
            />
        </LayoutWrapper>
    );
};

export default RegisterTab;