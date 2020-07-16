import React from 'react';

import ChannelSelectorItem from "./ChannelSelectorItem";
import {useSelector} from "react-redux";
import {BlockLayout, BlockTitle} from "../UI_elements";

let ChannelSelector = function(props) {

    const channels_settings = useSelector(state => state.plot.settings);
    const channels_data = useSelector(state => state.plot.data);

    return(
            <BlockLayout>
                <BlockTitle style={{gridRowEnd: 2}}>Channels</BlockTitle>
                    {channels_settings.map((chan,i) => {
                        return(
                            <ChannelSelectorItem key={chan.id} id={chan.id} idx={i} name={chan.name} value={channels_data[i].visible}/>
                        );
                    })}
            </BlockLayout>
        );
};

export default ChannelSelector;
