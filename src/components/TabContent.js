import React from 'react';
import PlotTab from "./plot_tab_components/PlotTab";
import RegisterTab from "./register_tab_components/Register_tab";



let TabContent = props => {
    if(props.type==='Scope'){
        return(
            <PlotTab content={props.content}/>
        );
    } else if(props.type==='Registers'){
        return (
            <RegisterTab content={props.content}/>
        );
    }
}

export default TabContent;
