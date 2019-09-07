import React from 'react';

import Container from "react-bootstrap/Container";

import ChannelSelectorItem from "./ChannelSelectorItem";


let ChannelSelector = function(props) {
    return(
            <Container>
                    {props.channels.map((chan) => {
                        return(
                            <ChannelSelectorItem name={chan.name} />
                        );
                    })}
            </Container>
        );
};

export default ChannelSelector;
