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

//       REACT IMPORTS
import React from 'react';
//       REDUX IMPORTS
import {useDispatch, useSelector} from "react-redux";
import {setSetting} from "../redux/Actions/SettingsActions";


import {initialize_channels} from "../redux/Actions/plotActions";
import ApplicationChooserView from "./Common_Components/ApplicationChooserView";

import {
    set_channel_widths,
    up_application,
    up_peripheral,
    create_plot_channel,
    get_channels_from_group,
    set_scaling_factors,
    set_channel_signs
} from "../client_core"
import {set_scope_address} from "../client_core/proxy/plot";

let ApplicationChooser = (props) =>{

    const applications = useSelector(state => state.applications);
    const dispatch = useDispatch();


    let handleApplicationChosen = async e =>{
        let app = new up_application(applications[e]);
        dispatch(setSetting(["selected_application", e]));
        try {
            await app.set_active();
            await app.load_soft_cores();
        }catch (error){
            console.log("Error: error while choosing application");
        }
        dispatch(setSetting(["application", e]));
        initializePlotState(applications[e]);
        props.choice_done();
    };

    let initializePlotState = (app) =>{

        let channels_list = [];
        if(app.channel_groups && app.channel_groups.length>0){
            for(let group of app.channel_groups){
                if(group.default){
                    dispatch(setSetting(["default_ch_group", group]));
                    channels_list = get_channels_from_group(group, app.channels);
                }
            }
        } else {
            channels_list = app.channels;
        }
        let ch_obj = [];
        for(let channel of channels_list){
            ch_obj.push(create_plot_channel(channel))
        }
        dispatch(initialize_channels(ch_obj));
        //SET UP MUXES FOR NEW GROUP
        let scope_mux_address = parseInt(app['miscellaneous']['scope_mux_address']);
        if(scope_mux_address){
            for(let item of channels_list){
                if(item){
                    let channel_address = scope_mux_address + 4*(parseInt(item.number)+1);
                    up_peripheral.direct_register_write([[channel_address, parseInt(item.mux_setting)]]).then();
                }
            }
            set_scope_address(scope_mux_address).then()
        }
        // SET UP CHANNEL WIDTHS

        if(channels_list.length !== 0){
            let widths = Array(6).fill(16);
            let sfs = Array(6).fill(1);
            let signs = Array(6).fill(true);
            for(let item of channels_list){
                if(item.phys_width){
                    widths[parseInt(item.number)] = parseInt(item.phys_width);
                }
                if(item.scaling_factor){
                    sfs[parseInt(item.number)] = parseFloat(item.scaling_factor);
                }
                if(item.signed !== undefined && item.signed !== null){
                    signs[parseInt(item.number)] = item.signed;
                }
            }
            set_channel_widths(widths).then();
            set_scaling_factors(sfs).then();
            set_channel_signs(signs).then();
        }
    }

    return (
        <div className="App">
            <ApplicationChooserView done={handleApplicationChosen}/>
        </div>
    );

}

export default ApplicationChooser;
