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
import {loadViews} from "../redux/Actions/ViewsActions";
import {loadRegisters} from "../redux/Actions/RegisterActions";



import {initialize_channels} from "../redux/Actions/plotActions";
import {create_plot_channel, get_channels_from_group} from "../utilities/PlotUtilities";
import ApplicationChooserView from "./Common_Components/ApplicationChooserView";

import {set_application} from "../client_core"

let ApplicationChooser = (props) =>{

    const settings = useSelector(state => state.settings);
    const applications = useSelector(state => state.applications);
    const dispatch = useDispatch();


    let handleApplicationChosen = e =>{
        set_application(e).then(()=>{
            dispatch(setSetting(["application", e]));
            let peripherals = Object.values(applications[e].peripherals);
            dispatch(loadViews(peripherals))
            initializePlotState(applications[e]);
            settings.server.plot_proxy.getChannelsInfo(function(){handle_loading_channels_done(peripherals);});
        }).catch(error =>{
            console.log("Error: error while choosing application");
        });
    };

    let handle_loading_channels_done = (periph) =>{
        initializeRegisterStore(periph);
    }

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
        let scope_mux_address = parseInt(app['scope_mux_address']);
        if(scope_mux_address){
            let components = [];
            for(let item of channels_list){
                let channel_mux = parseInt(item.mux_setting)<<4*item.number;
                components.push(channel_mux);
            }
            let word = 0x1000000;
            for(let item of components){
                word |= item;
            }
            settings.server.periph_proxy.bulkRegisterWrite({payload:[{address:scope_mux_address, value:word}]});
        }
        // SET UP CHANNEL WIDTHS

        if(channels_list.length !== 0){
            let widths = []
            for(let item of channels_list){
                widths.push(parseInt(item.phys_width));
            }
            settings.server.plot_proxy.set_channel_widths(widths);
        }


    }

    let initializeRegisterStore = (peripherals) =>{

        Promise.all(peripherals.map((tab) =>{
            if(tab.user_accessible && tab.type==="Registers"){
                return settings.server.periph_proxy.getPeripheralRegisters(tab.peripheral_id);
            }
            return 'Not Needed';
        })).then((result) =>{
                result.map((item) => {
                    if(item!=='Not Needed'){
                        dispatch(loadRegisters(item.peripheral_name, item.registers))
                    }
                    return null
                });
                loadResources();
            }
        ).catch((reason => {
            console.log(reason)
        }));

    };

    let loadResources = () => {

        let role_mapping = {admin:1, user:2, operator:3};
        let role = role_mapping[settings.user_role]
        if(role<=3){
            dispatch(loadViews([{
                name: "Plot",
                peripheral_id: "plot",
                type: "Scope",
                user_accessible: true
            }]))
        }
        if(role<=2){
            dispatch(loadViews([{
                name: "Script manager",
                peripheral_id: "script_manager",
                type: "script_manager",
                user_accessible: true
            }]))
            dispatch(loadViews([{
                name: "Applications manager",
                peripheral_id: "applications_manager",
                type: "applications_manager",
                user_accessible: true
            }]));
            dispatch(loadViews([{
                name: "Program Manager",
                peripheral_id: "program_manager",
                type: "program_manager",
                user_accessible: true
            }]));
            dispatch(loadViews([{
                name: "Bitstream Manager",
                peripheral_id: "bitstream_manager",
                type: "bitstream_manager",
                user_accessible: true
            }]));
        }
        if(role<=1){
            dispatch(loadViews([{
                name: "Peripherals manager",
                peripheral_id: "peripherals_manager",
                type: "peripherals_manager",
                user_accessible: true
            }]))

            dispatch(loadViews([{
                name: "Platform Manager",
                peripheral_id: "platform_manager",
                type: "platform_manager",
                user_accessible: true
            }]));
        }
        props.choice_done();
    };

    return (
        <div className="App">
            <ApplicationChooserView done={handleApplicationChosen}/>
        </div>
    );

}

export default ApplicationChooser;
