import React from 'react';

import ChannelSelectorItem from "./ChannelSelectorItem";
import {useSelector} from "react-redux";
import styled from "styled-components";

const ComponentStyle = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    grid-auto-rows: auto;
    grid-row-gap: 1em;
    background-color: #5a5a5a;
    border-radius: 1rem;
    padding: 1rem;
`

let ChannelSelector = function(props) {
    const channels_settings = useSelector(state => state.plot.settings);
    const channels_data = useSelector(state => state.plot.data);
    return(
            <ComponentStyle>
                    {channels_settings.map((chan,i) => {
                        return(
                            <ChannelSelectorItem key={chan.id} id={chan.id} idx={i} name={chan.name} server={props.server} value={channels_data[i].visible}/>
                        );
                    })}
            </ComponentStyle>
        );
};

export default ChannelSelector;
