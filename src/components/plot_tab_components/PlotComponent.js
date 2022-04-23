// Copyright 2021 University of Nottingham Ningbo China
// Author: Filippo Savi <filssavi@gmail.com>
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import React from 'react';
import useInterval from "../Common_Components/useInterval";

import Plotly from 'plotly.js-basic-dist';
import createPlotlyComponent from 'react-plotly.js/factory';
import {useSelector} from "react-redux";
import styled from "styled-components";
import PlotControls from "./PlotControls";

import {fetch_data} from '../../client_core'

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
            fetch_data();
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
