import React from 'react';
import {useSelector} from "react-redux";


import ChannelSelector from "./ChannelSelector";
import PlotComponent from "./PlotComponent";
import ParametersArea from "./ParametersArea";
import MacroActions from "./MacroActions";
import styled from "styled-components";
import {ColorTheme} from "../UI_elements";


const ComponentLayout = styled.div`
  display: grid;
  grid-template-columns: auto auto;
  grid-auto-rows: auto;
  align-items: center;
  grid-gap: 1.5em;
`

let PlotTab = function (props) {
    const channels = useSelector(state => state.channels);
    const settings = useSelector(state => state.settings);

        return(
            <ComponentLayout>
                <ChannelSelector channels={channels}/>
                <PlotComponent palette={{colorway:ColorTheme.plot_palette}} refreshRate={settings.refreshRate}/>
                <ParametersArea />
                <MacroActions />
            </ComponentLayout>
        );
};

export default PlotTab;
