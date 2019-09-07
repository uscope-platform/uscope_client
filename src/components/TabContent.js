import React, {Component} from 'react';
import PlotTab from "./plot_tab_components/PlotTab";
import RegisterTab from "./register_tab_components/Register_tab";

class TabContent extends Component {


    render() {
        if(this.props.type==='Scope'){
            return(
                <PlotTab content={this.props.content}/>
            );
        } else if(this.props.type==='Registers'){
            return (
                <RegisterTab content={this.props.content}/>
            );
        }

    }

}

export default TabContent;
