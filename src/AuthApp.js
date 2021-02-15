//       REACT IMPORTS
import React, {useEffect, useState} from 'react';
import {Redirect, Route} from 'react-router-dom'
//       REDUX IMPORTS
import {useDispatch, useSelector} from "react-redux";
import {setSetting} from "./redux/Actions/SettingsActions";
import {loadViews} from "./redux/Actions/ViewsActions";
import {loadRegisters} from "./redux/Actions/RegisterActions";
//      APP RELATED IMPORTS
import TabContent from "./components/TabContent";
import Navbar from "./components/Navbar";

import ApplicationChooser from "./components/Common_Components/ApplicationChooser";
//////  STYLE IMPORTS
import './App.css';


import {ApplicationLayout} from "./components/UI_elements";
import Sidebar from "./components/Sidebar/Sidebar";
import {initialize_channels} from "./redux/Actions/plotActions";
import {create_plot_channel, get_channels_from_group} from "./utilities/PlotUtilities";


const states = Object.freeze({
    START:   Symbol("start"),
    APP_CHOICE:  Symbol("app_choice"),
    RESOURCE_LOADING: Symbol("resource_loading"),
    NORMAL: Symbol("normal"),
});


let AuthApp = (props) =>{

    const views = useSelector(state => state.views);
    const plot = useSelector(state => state.plot);
    const scripts = useSelector(state => state.scripts);
    const programs = useSelector(state => state.programs);
    const settings = useSelector(state => state.settings);
    const peripherals = useSelector(state => state.peripherals);
    const applications = useSelector(state => state.applications);

    const dispatch = useDispatch();

    const [init_phase, set_init_phase] = useState(states.APP_CHOICE);

    let load_resource = (resource) =>{
        let digest = localStorage.getItem(resource.key);
        if(resource.store === undefined || digest === null){
            resource.proxy.load_all();
            resource.proxy.get_hash().then((res)=>{
                localStorage.setItem(resource.key, res);
            });
        } else{
            resource.proxy.get_hash().then((res)=>{
                if(digest!==res){
                    resource.proxy.load_all();
                    localStorage.setItem(resource.key, res);
                }
            });
        }
    }

    useEffect(()=>{
        let resources = [{
            key:'Applications-hash',
            proxy:settings.server.app_proxy,
            store:applications
        }, {
            key:'Peripherals-hash',
            proxy:settings.server.periph_proxy,
            store:peripherals
        }, {
            key:'Script-hash',
            proxy:settings.server.script_proxy,
            store:scripts
        }, {
            key:'Programs-hash',
            proxy:settings.server.prog_proxy,
            store:programs
        }]

        for(let i of resources){
            load_resource(i);
        }

    },[])


    let handleApplicationChosen = e =>{
        settings.server.app_proxy.setApplication(e).then(()=>{
            let app = applications[e];
            dispatch(setSetting(["application", e]));
            let peripherals = Object.values(app.peripherals);
            dispatch(loadViews(peripherals))
            initializePlotState(app);
            initializeRegisterStore(peripherals);
        }).catch(error =>{
        });
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
        let widths = []
        for(let item of channels_list){
            widths.push(parseInt(item.phys_width));
        }
        settings.server.plot_proxy.set_channel_widths(widths);

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
                set_init_phase(states.RESOURCE_LOADING);
                loadResources();
            }
        ).catch((reason => {
            console.log(reason)
        }));

    };

    let loadResources = () => {
        settings.server.plot_proxy.getChannelsInfo();
        dispatch(loadViews([{
            name: "Plot",
            peripheral_id: "plot",
            type: "Scope",
            user_accessible: true
        }]))
        dispatch(loadViews([{
            name: "Script manager",
            peripheral_id: "script_manager",
            type: "script_manager",
            user_accessible: true
        }]))
        dispatch(loadViews([{
            name: "Peripherals manager",
            peripheral_id: "peripherals_manager",
            type: "peripherals_manager",
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
        set_init_phase(states.NORMAL)
    };

    switch (init_phase) {
        case states.APP_CHOICE:
            return (
                <div className="App">
                    <ApplicationChooser done={handleApplicationChosen}/>
                </div>
            );
        case states.NORMAL:

            if(!plot.loading_done){
                return(
                    <></>
                )
            } else {
                return (
                    <div className="App">
                            <ApplicationLayout name="plot_tab" sidebarNeeded={settings.current_view_requires_sidebar}>
                                <Navbar views={views}/>
                                {views.map((tab, i) => {
                                    if(tab.user_accessible){
                                        return(
                                            <Route
                                                key={tab.peripheral_id}
                                                path={'/'+tab.peripheral_id}
                                                exact
                                                render={(props) => <TabContent className="main_content_tab" tab={tab}/>}
                                            />

                                        )
                                    } else {
                                        return null;
                                    }
                                })}
                                <Sidebar />
                            </ApplicationLayout>
                        <Redirect exact from="/" to="plot" />
                    </div>
                );
            }
        default:
            return(
                <>
                </>
            )
    }

}

export default AuthApp;
