import React, {Component} from 'react';

import Form from "react-bootstrap/Form";
import {Image} from "react-bootstrap";



class ChannelSelectorItem extends Component {

    render() {
        return(
            <Form.Group controlId="channel_select">
                <Form.Check className="channel_select_checkbox" inline type='checkbox' id={'checkbox_channel_select'}/>
                <Form.Label className="channel_select_label">{this.props.name}</Form.Label>
                <Image  className="settings_icon" src='assets/Icons/settings.png'/>
            </Form.Group>
        );
    }

}

export default ChannelSelectorItem;
