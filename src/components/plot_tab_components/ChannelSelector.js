import React from 'react';

import Container from "react-bootstrap/Container";

import ChannelSelectorItem from "./ChannelSelectorItem";
import {useSelector} from "react-redux";

let ChannelSelector = function(props) {
    const channels_settings = useSelector(state => state.plot.settings);
    const channels_data = useSelector(state => state.plot.data);
    return(
            <Container>
                    {channels_settings.map((chan,i) => {
                        return(
                            <ChannelSelectorItem id={chan.id} idx={i} name={chan.name} server={props.server} value={channels_data[i].visible}/>
                        );
                    })}
            </Container>
        );
};

export default ChannelSelector;
