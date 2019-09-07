import React, {Component} from 'react';

import Container from "react-bootstrap/Container";

import ChannelSelectorItem from "./ChannelSelectorItem";

class ChannelSelector extends Component {

    render() {
        return(
            <Container>
                {this.props.content.channels.map((chan) => {
                    return(
                        <ChannelSelectorItem name={chan.name}/>
                    );
                })}
            </Container>
        );
    }

}

export default ChannelSelector;
