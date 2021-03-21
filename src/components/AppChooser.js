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


let ApplicationChooser = (props) =>{

    const settings = useSelector(state => state.settings);
    const applications = useSelector(state => state.applications);
    const dispatch = useDispatch();

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
        dispatch(loadViews([{
            name: "Platform Manager",
            peripheral_id: "platform_manager",
            type: "platform_manager",
            user_accessible: true
        }]));
        debugger;
        dispatch(setSetting(["app_stage", "NORMAL"]));
    };

    return (
        <div className="App">
            <ApplicationChooserView done={handleApplicationChosen}/>
        </div>
    );

}

export default ApplicationChooser;
