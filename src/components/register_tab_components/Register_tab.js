import React, {useCallback, useEffect} from 'react';
import Image from "../UI_elements/Image";

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
            <Image src={props.server.server_url + props.content.image_src} alt='Peripheral diagram' fluid/>
            <RegisterInputForm registers={peripherals[props.content.tab_id].registers}
                               values={registerValues[props.content.tab_id]}
                               server={props.server}
                               content={registerValues[props.content.tab_id]}
                               parent_peripheral={props.content.tab_id}
            />
        </LayoutWrapper>
    );
};

export default RegisterTab;