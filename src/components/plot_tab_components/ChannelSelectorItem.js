import React from 'react';

import Form from "react-bootstrap/Form";
import {Image} from "react-bootstrap";
import {enableChannel, disableChannel} from "../../reduxActions/ChannelStatusActions";
import {useDispatch} from "react-redux";


function ChannelSelectorItem(props){
    const dispatch = useDispatch();

    function handleChannelStateChange(event){
        if(event.target.checked){
            dispatch(enableChannel(event.target.name));
        } else{
            dispatch(disableChannel(event.target.name));
        }
    }

    return(
        <Form.Group controlId="channel_select">
            <input className="channel_select_checkbox" type="checkbox" name={props.name} onChange={handleChannelStateChange} />
            <Form.Label className="channel_select_label">{props.name}</Form.Label>
            <Image  className="settings_icon" src='assets/Icons/settings.png'/>
        </Form.Group>
    );
}


export default ChannelSelectorItem;
