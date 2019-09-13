import React from 'react';

import Form from "react-bootstrap/Form";
import {Image} from "react-bootstrap";
import {enableChannel, disableChannel} from "../../redux/Actions/plotActions";
import {useDispatch} from "react-redux";


function ChannelSelectorItem(props){
    const dispatch = useDispatch();

    function handleChannelStateChange(event){
        if(event.target.checked){
            dispatch(enableChannel(event.target.id-1));
        } else{
            dispatch(disableChannel(event.target.id-1));
        }
    }

    return(
        <div className="channel_enable_group">
            <Form.Group controlId="channel_select">
                <input className="channel_select_checkbox" type="checkbox" id={props.id} name={props.name} onChange={handleChannelStateChange} checked={props.value}/>
                <Form.Label className="channel_select_label">{props.name}</Form.Label>
                <Image  className="settings_icon" src='assets/Icons/settings.png'/>
            </Form.Group>
        </div>
    );
}


export default ChannelSelectorItem;
