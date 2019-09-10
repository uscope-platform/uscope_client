import React from 'react';
import PlotTab from "./plot_tab_components/PlotTab";
import RegisterTab from "./register_tab_components/Register_tab";


let TabContent = props => {
    if(props.tab.type==='Scope'){
        return(
            <div className="tab_content">
                <PlotTab server={props.server} content={props.tab}/>
            </div>
        );
    } else if(props.tab.type==='Registers'){
        return (
            <div className="tab_content">
                <RegisterTab server={props.server} content={props.tab}/>
            </div>
        );
    } else{
        return (null)
    }
};

export default TabContent;
