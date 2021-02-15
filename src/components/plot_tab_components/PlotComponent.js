import React from 'react';
import useInterval from "../Common_Components/useInterval";

import Plotly from 'plotly.js-basic-dist';
import createPlotlyComponent from 'react-plotly.js/factory';
import {useSelector} from "react-redux";
import styled from "styled-components";
import PlotControls from "./PlotControls";

const Plot = createPlotlyComponent(Plotly);

const ComponentStyle = styled.div`
  display: grid;
  grid-template-columns: auto auto;
  grid-auto-rows: auto;
  grid-row-gap: 1em;
`

let  PlotComponent = props =>{
    const channels = useSelector(state => state.plot);
    const settings = useSelector(state => state.settings);

    let  handleRefresh = () =>{
        if(channels.plot_running){
            settings.server.plot_proxy.fetchData();
        }
    };

    useInterval(() => {
        handleRefresh();
    },  props.refreshRate);

    return(
        <ComponentStyle>
            <Plot
                data={channels.data}
                layout={{...channels.layout,...settings.plot_palette}}
                config={channels.configs}
                datarevision={props.datarevision}
            />
            <PlotControls/>
        </ComponentStyle>
    );
};

export default PlotComponent;
