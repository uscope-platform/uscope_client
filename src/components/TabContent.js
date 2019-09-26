import React from 'react';
import PlotTab from "./plot_tab_components/PlotTab";
import RegisterTab from "./register_tab_components/Register_tab";
import TabCreator from "./Tab_creator/TabCreator";
import ScriptManager from "./Managers/ScriptManager_tab";


let TabContent = props => {
    if(props.tab.type==='Scope'){
        return(
            <div className="tab_content">
                <PlotTab server={props.server} content={props.tab}/>
            </div>
        );
    } else if(props.tab.type==='Registers') {
        return (
            <div className="tab_content">
                <RegisterTab server={props.server} content={props.tab}/>
            </div>
        );
    }else if(props.tab.type ==='tab_creator'){
        return (
            <TabCreator server={props.server}/>
        );
    }else if(props.tab.type ==='script_manager'){
        return (
            <ScriptManager server={props.server}/>
        );
    } else{
        return (null)
    }
};

export default TabContent;
