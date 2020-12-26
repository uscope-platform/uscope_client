import React, {useEffect, useState} from 'react';

import ChannelSelectorItem from "./ChannelSelectorItem";
import {useSelector} from "react-redux";
import {BlockLayout, BlockTitle} from "../UI_elements";
import {get_channel_number_from_id} from "../../utilities/PlotUtilities";

let ChannelSelector = function(props) {
    const settings = useSelector(state => state.settings);
    const channels_data = useSelector(state => state.plot.data);
    const [channel_state, set_channel_state] = useState({});

    useEffect(()=>{
        let new_ch_state = {}
        channels_data.map(chan => {
            new_ch_state[chan.spec.number] = chan.visible;
            return 0;
        })
        set_channel_state(new_ch_state);
        settings.server.plot_proxy.set_channel_status(new_ch_state);
    },[])

    let handle_status_change = status =>{
        let new_state = channel_state;
        let channel_number = get_channel_number_from_id(parseInt(status.id), channels_data);
        new_state[parseInt(channel_number)] = status.status;
        set_channel_state(new_state);
        settings.server.plot_proxy.set_channel_status(new_state);
    }

    return(
            <BlockLayout>
                <BlockTitle style={{gridRowEnd: 2}}>Channels</BlockTitle>
                    {channels_data.map((chan,i) => {
                        return(
                            <ChannelSelectorItem onStatusChange={handle_status_change} key={chan.spec.id} id={chan.spec.id} idx={i} name={chan.spec.name} value={chan.visible}/>
                        );
                    })}
            </BlockLayout>
        );
};

export default ChannelSelector;
