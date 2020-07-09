import React, {useEffect} from 'react';

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

    //This effect hook handles creation and clearing of the plot refresh timer
    useEffect(() => {
        let  handleRefresh = () =>{
            if(channels.plot_running){
                props.server.plot_proxy.fetchData();
            }
        };

        let refreshCallback = window.setInterval(handleRefresh, props.refreshRate);
        return () => {
            window.clearInterval(refreshCallback);
        };
    });

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
