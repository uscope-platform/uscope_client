import React from 'react';
import Image from "../UI_elements/Image";

import {useSelector} from "react-redux";
import RegisterInputForm from "./RegisterInputForm";
import styled from "styled-components";


const LayoutWrapper = styled.div`
    display: grid;
    grid-template-columns: 1fr 2fr;
    grid-auto-rows: minmax(0, 10rem);
    grid-gap: 1.5rem;
    margin-top: 1rem;
    margin-right: 1rem;
    margin-left: 1rem;

`

let RegisterTab  = props => {
    const register_values = useSelector(
        state => state.registerValues[props.content.tab_id]
    );

    const register_specs = useSelector(
        state => state.peripherals[props.content.tab_id]
    );

    return(
        <LayoutWrapper>
            <Image src={props.server.server_url + props.content.image_src} alt='Peripheral diagram' fluid/>
            <RegisterInputForm registers={register_specs.registers} values={register_values} server={props.server} content={props.content}/>
        </LayoutWrapper>
    );
};

export default RegisterTab;
