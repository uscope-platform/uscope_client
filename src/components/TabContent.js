import React from 'react';
import PlotTab from "./plot_tab_components/PlotTab";
import RegisterTab from "./register_tab_components/Register_tab";
import ScriptManager from "./Managers/ScriptManager_tab";
import PeripheralsManager from "./Managers/PeripheralsManager";
import ApplicationsManager from "./Managers/ApplicationsManager"

let TabContent = props => {
    if(props.tab.type==='Scope'){
        return(
            <PlotTab content={props.tab}/>
        );
    } else if(props.tab.type==='Registers') {
        return (
            <div className="tab_content">
                <RegisterTab content={props.tab}/>
            </div>
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
    }else{
        return null
    }
};

export default TabContent;
