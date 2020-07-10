import React, {useState} from 'react';

import {enableChannel, disableChannel} from "../../redux/Actions/plotActions";
import {useDispatch} from "react-redux";
import {showModal} from "../../redux/Actions/modalsActions";
import ChannelSettingsModal from "../Modal_Components/ChannelSettingsModal";
import Checkbox from "../UI_elements/checkbox";
import {Configure} from "grommet-icons";
import styled from "styled-components";

const ComponentStyle = styled.div`
  display: grid;
  grid-template-columns: auto auto;
  grid-auto-rows: auto;
  grid-column-gap: 0.5rem;
  grid-row-gap: 2rem;
  margin: 0 auto;
`


let  ChannelSelectorItem = props => {
    const dispatch = useDispatch();
    const [enabled, set_enabled] = useState(false);

    function handleChannelStateChange(event){
        set_enabled(event.target.checked)
        if(event.target.checked){
            dispatch(enableChannel(parseInt(event.target.name)-1));
        } else{
            dispatch(disableChannel(parseInt(event.target.name)-1));
        }
    }

    return(
        <ComponentStyle>
            <ChannelSettingsModal id={props.idx} server={props.server}/>
            <Checkbox name={props.id} onChange={handleChannelStateChange} value={enabled} label={props.name}/>
            <Configure color='white' onClick={() =>(dispatch(showModal('channel_settings_choice', props.idx)))}/>
        </ComponentStyle>
    );
}


export default ChannelSelectorItem;
