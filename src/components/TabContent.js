import React from 'react';
import PlotTab from "./plot_tab_components/PlotTab";
import RegisterTab from "./register_tab_components/Register_tab";
import PeripheralsCreator from "./Creators/Peripheral_creator/PeripheralsCreator";
import ScriptManager from "./Managers/ScriptManager_tab";
import PeripheralsManager from "./Managers/PeripheralsManager";
import ApplicationsManager from "./Managers/ApplicationsManager"

let TabContent = props => {
    if(props.tab.type==='Scope'){
        return(
            <div className="tab_content">
                <PlotTab content={props.tab}/>
            </div>
        );
    } else if(props.tab.type==='Registers') {
        return (
            <div className="tab_content">
                <RegisterTab content={props.tab}/>
            </div>
        );
    }else if(props.tab.type ==='tab_creator'){
        return (
            <PeripheralsCreator />
        );
    }else if(props.tab.type ==='script_manager'){
        return (
            <ScriptManager />
        );
    }else if(props.tab.type ==='peripherals_manager'){
        return (
            <PeripheralsManager />
        );
    }else if(props.tab.type ==='applications_manager'){
        return (
            <ApplicationsManager />
        );
    } else{
        return null
    }
};

export default TabContent;
