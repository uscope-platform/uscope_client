import React from 'react';

import Container from "react-bootstrap/Container";

import ChannelSelectorItem from "./ChannelSelectorItem";


let ChannelSelector = function(props) {
    return(
            <Container>
                    {props.channels.map((chan,i) => {
                        return(
                            <ChannelSelectorItem key={i} name={chan.name} />
                        );
                    })}
            </Container>
        );
};

export default ChannelSelector;
