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

import React, {useContext, useEffect, useReducer, useState} from 'react';
import Plotly from 'plotly.js-basic-dist';
import createPlotlyComponent from 'react-plotly.js/factory';

import {PlotConfigurations} from "../../UI_elements";
import {download_plot, initialize_plot} from "../../../client_core";
import {update_plot_data} from "../../../client_core/plot_handling";
import useInterval from "../../Common_Components/useInterval";
import {ApplicationContext} from "../../../AuthApp";

const Plot = createPlotlyComponent(Plotly);



let  PlotComponent = props =>{

    const application = useContext(ApplicationContext);

    const [plot_data, set_plot_data] = useState([]);
    const [data_revision, bump_revision] = useReducer(x => x + 1, 1);

    const [acquisition_counter, set_acquisition_counter] = useState(0);

    useEffect(()=>{
        let data = initialize_plot(application);
        set_plot_data(data);
        props.on_data_init(data);
    }, [application])

    useEffect(()=>{
        if(plot_data.length > 0){
            download_plot(plot_data, props.selected_group);
        }

    }, [props.request_download])

    useEffect(()=>{
        set_plot_data(props.external_data);
    }, [props.external_data])

    let  handleRefresh = async () =>{
        if(props.plot_status){
            let new_plot_data =await update_plot_data(plot_data);
            set_plot_data(new_plot_data);
            bump_revision();
            if(acquisition_counter===9){
                props.on_update_acquisition_status();
                set_acquisition_counter(0);
            } else{
                set_acquisition_counter(acquisition_counter + 1);
            }
        }
    };

    useInterval(async () => {
        await handleRefresh();
    },  PlotConfigurations.refresh_rate);

    return(
        <Plot
            data={plot_data}
            layout={{...PlotConfigurations.layout,...props.palette}}
            config={{...PlotConfigurations.configs, response:true}}
            datarevision={data_revision + props.external_revision}
        />
    );
};

export default PlotComponent;
