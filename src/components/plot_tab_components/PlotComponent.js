import React, {Component} from 'react';

import Plotly from 'plotly.js-dist';
import createPlotlyComponent from 'react-plotly.js/factory';
import {connect} from "react-redux";
const Plot = createPlotlyComponent(Plotly);



function mapStateToProps(state) {
    return{
        channels:state.channels,
        settings:state.settings,
        plot:state.plot,
        data:state.data
    }
}

class PlotComponent extends Component {



    componentDidMount() {
        this.refreshCallback = window.setInterval(this.handleRefresh, this.props.refreshRate);

    }

    componentWillUnmount() {
        window.clearInterval(this.refreshCallback);
    }


    handleRefresh = () =>{
        if(this.props.plot.running){
            debugger;
        }
    };

    render() {
        return (
            <div className="plot_div_container">
                <Plot
                    data={this.props.settings.plot.data}
                    layout={this.props.settings.plot.layout}
                    config={this.props.settings.plot.configs}
                />
            </div>
        );
    }
}

export default connect(mapStateToProps)(PlotComponent);

