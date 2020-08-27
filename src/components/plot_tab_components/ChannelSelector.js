import React, {useEffect, useState} from 'react';

import ChannelSelectorItem from "./ChannelSelectorItem";
import {useSelector} from "react-redux";
import {BlockLayout, BlockTitle} from "../UI_elements";

let ChannelSelector = function(props) {
    const settings = useSelector(state => state.settings);
    const channels_settings = useSelector(state => state.plot.settings);
    const channels_data = useSelector(state => state.plot.data);
    const [channel_state, set_channel_state] = useState({});

    useEffect(()=>{
        let new_ch_state = {}
        channels_settings.map((chan,i) => {
            new_ch_state[chan.id-1] = channels_data[i].visible;
            return 0;
        })
        set_channel_state(new_ch_state);
    },[])

    let handle_status_change = status =>{
        let new_state = channel_state;
        new_state[status.id] = status.status;
        set_channel_state(new_state);
        settings.server.plot_proxy.set_channel_status(new_state);
    }
    return(
            <BlockLayout>
                <BlockTitle style={{gridRowEnd: 2}}>Channels</BlockTitle>
                    {channels_settings.map((chan,i) => {
                        return(
                            <ChannelSelectorItem onStatusChange={handle_status_change} key={chan.id} id={chan.id} idx={i} name={chan.name} value={channels_data[i].visible}/>
                        );
                    })}
            </BlockLayout>
        );
};

export default ChannelSelector;
