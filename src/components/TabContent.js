import React from 'react';
import PlotTab from "./plot_tab_components/PlotTab";
import RegisterTab from "./register_tab_components/Register_tab";


let TabContent = props => {
    if(props.tab.type==='Scope'){
        return(
            <PlotTab server={props.server} content={props.tab}/>
        );
    } else if(props.tab.type==='Registers'){
        return (
            <RegisterTab server={props.server} content={props.tab}/>
        );
    } else{
        return (null)
    }
};

export default TabContent;
