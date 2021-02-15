import React, {useEffect} from 'react';

import ChannelSelectorItem from "./ChannelSelectorItem";
import {useSelector} from "react-redux";
import {BlockLayout, BlockTitle, ColorTheme} from "../UI_elements";
import {get_channel_number_from_id} from "../../utilities/PlotUtilities";
import {setSetting} from "../../redux/Actions/SettingsActions";
import {useDispatch} from "react-redux";

let ChannelSelector = function(props) {
    const settings = useSelector(state => state.settings);
    const channels_data = useSelector(state => state.plot.data);
    const dispatch = useDispatch();

    useEffect(()=>{
        let new_ch_state = get_state();
        settings.server.plot_proxy.set_channel_status(new_ch_state);
    },[])

    let get_state = ()=>{
        let new_ch_state = {}
        channels_data.map(chan => {
            new_ch_state[chan.spec.number] = chan.visible;
            return 0;
        })
        return new_ch_state;
    }

    let handle_status_change = status =>{
        let new_state = get_state();
        let channel_number = get_channel_number_from_id(status.id, channels_data);
        new_state[parseInt(channel_number)] = status.status;
        settings.server.plot_proxy.set_channel_status(new_state);

        let palette = [];
        for(let item in new_state){

            if(new_state[item]){
                palette.push(ColorTheme.plot_palette[parseInt(item)]);
            }
        }
        dispatch(setSetting(["plot_palette", {colorway: palette}]));
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
