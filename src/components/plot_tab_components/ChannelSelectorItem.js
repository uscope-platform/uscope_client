import React from 'react';

import {Image} from "react-bootstrap";
import {enableChannel, disableChannel} from "../../redux/Actions/plotActions";
import {useDispatch} from "react-redux";
import {showModal} from "../../redux/Actions/modalsActions";
import ChannelSettingsModal from "../Modal_Components/ChannelSettingsModal";
import Checkbox from "../UI_elements/checkbox";


function ChannelSelectorItem(props){
    const dispatch = useDispatch();

    function handleChannelStateChange(event){
        if(event.target.checked){
            dispatch(enableChannel(parseInt(event.target.name)-1));
        } else{
            dispatch(disableChannel(parseInt(event.target.name)-1));
        }
    }

    return(
        <div className="channel_enable_group">
            <ChannelSettingsModal id={props.idx} server={props.server}/>
            <Checkbox name={props.id} onChange={handleChannelStateChange} label={props.name}/>
            <Image  className="settings_icon" src='assets/Icons/settings.png' onClick={() =>(dispatch(showModal('channel_settings_choice', props.idx)))}/>
        </div>
    );
}


export default ChannelSelectorItem;
