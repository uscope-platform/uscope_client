import React from 'react';

import Container from "react-bootstrap/Container";

import ChannelSelectorItem from "./ChannelSelectorItem";
import {useSelector} from "react-redux";

let ChannelSelector = function(props) {
    const channels_settings = useSelector(state => state.channels.settings);
    return(
            <Container>
                    {channels_settings.map((chan,i) => {
                        return(
                            <ChannelSelectorItem id={chan.id} key={i} name={chan.name} />
                        );
                    })}
            </Container>
        );
};

export default ChannelSelector;
