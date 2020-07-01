import React, {Component} from 'react';

import Plotly from 'plotly.js-dist';
import createPlotlyComponent from 'react-plotly.js/factory';
import {connect} from "react-redux";
const Plot = createPlotlyComponent(Plotly);



function mapStateToProps(state) {
    return{
        channels:state.plot,
        settings:state.settings,
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
        if(this.props.channels.plot_running){
            this.props.server.plot_proxy.fetchData();
        }
    };

    render() {
        return (
            <div className="plot_div_container">
                <Plot
                    data={this.props.channels.data}
                    layout={this.props.channels.layout}
                    config={this.props.channels.configs}
                    datarevision={this.props.datarevision}
                />
            </div>
        );
    }
}

export default connect(mapStateToProps)(PlotComponent);

