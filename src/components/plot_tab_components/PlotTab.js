import React from 'react';
import {useSelector} from "react-redux";


import ChannelSelector from "./ChannelSelector";
import PlotComponent from "./PlotComponent";
import ParametersArea from "./ParametersArea";
import MacroActions from "./MacroActions";
import styled from "styled-components";


const ComponentLayout = styled.div`
  display: grid;
  grid-template-columns: auto auto;
  grid-auto-rows: auto;
  grid-gap: 2em;
`

let PlotTab = function (props) {
    const channels = useSelector(state => state.channels);
    const settings = useSelector(state => state.settings);
    let controls = [
        {
            name:"play",
            image:"assets/Icons/play.svg"
        },
        {
            name:"pause",
            image:"assets/Icons/pause.svg"
        },
        {
            name:"stop",
            image:"assets/Icons/stop.svg"
        },
        {
            name:"timebase",
            image:"assets/Icons/timebase.svg"
        },
        {
            name:"mode",
            image:"assets/Icons/mode.svg"
        },

    ];

        return(
            <ComponentLayout>
                <ChannelSelector server={props.server} channels={channels}/>
                <PlotComponent refreshRate={settings.refreshRate} server={props.server}/>
                <MacroActions server={props.server}/>
                <ParametersArea server={props.server}/>
            </ComponentLayout>
        );
};

export default PlotTab;
