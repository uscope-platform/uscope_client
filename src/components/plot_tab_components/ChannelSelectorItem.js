import React, {useState} from 'react';

import {disableChannel, enableChannel} from "../../redux/Actions/plotActions";
import {useDispatch, useSelector} from "react-redux";
import {Checkbox} from "../UI_elements";
import styled from "styled-components";

const Centering = styled.div`
  margin: 0 auto;  
`

let  ChannelSelectorItem = props => {
    const settings = useSelector(state => state.settings);
    const [enabled, set_enabled] = useState(false);

    function handleChannelStateChange(event){
        set_enabled(event.target.checked)
        if(event.target.checked){
            settings.server.plot_proxy.enable_channel(parseInt(event.target.name)-1);
        } else{
            settings.server.plot_proxy.disable_channel(parseInt(event.target.name)-1);
        }
    }

    return(
        <Centering>
            <Checkbox style={{marginRight:'0.5rem'}} name={props.id} onChange={handleChannelStateChange} value={enabled} label={props.name}/>
        </Centering>
    );
}


export default ChannelSelectorItem;
