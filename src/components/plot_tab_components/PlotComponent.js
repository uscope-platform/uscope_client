import React, {useEffect} from 'react';
import useInterval from "../Common_Components/useInterval";

import Plotly from 'plotly.js-dist';
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

    let  handleRefresh = () =>{
        if(channels.plot_running){
            props.server.plot_proxy.fetchData();
        }
    };

    useInterval(() => {
        // Your custom logic here
        handleRefresh();
    },  props.refreshRate);

    return(
        <ComponentStyle>
            <Plot
                data={channels.data}
                layout={channels.layout}
                config={channels.configs}
                datarevision={props.datarevision}
            />
            <PlotControls server={props.server} />
        </ComponentStyle>
    );
};

export default PlotComponent;
