import React, {useState} from 'react';

import {Checkbox} from "../UI_elements";
import styled from "styled-components";

const Centering = styled.div`
  margin: 0 auto;  
`

let  ChannelSelectorItem = props => {
    const [enabled, set_enabled] = useState(false);

    function handleChannelStateChange(event){
        set_enabled(event.target.checked)
        let channel_status = {id:event.target.name, status:event.target.checked}
        props.onStatusChange(channel_status);
    }

    return(
        <Centering>
            <Checkbox style={{marginRight:'0.5rem'}} name={props.id} onChange={handleChannelStateChange} value={enabled} label={props.name}/>
        </Centering>
    );
}


export default ChannelSelectorItem;
