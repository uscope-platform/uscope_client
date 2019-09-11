import React, {Component} from 'react';

import Plotly from 'plotly.js-dist';
import createPlotlyComponent from 'react-plotly.js/factory';
import {connect} from "react-redux";
const Plot = createPlotlyComponent(Plotly);



function mapStateToProps(state) {
    return{
        settings:state.settings
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

    };

    render() {
        return (
            <div className="plot_div_container">
                <Plot
                    data={[
                        {
                            x: Array.from(Array(this.props.settings.plot.memory_depth).keys()),
                            y: Array.from(Array(this.props.settings.plot.memory_depth).keys()),
                            type: 'scatter',
                            mode: 'lines',
                            marker: {color: 'white'},
                        }
                    ]}
                    layout={this.props.settings.plot.layout}
                    config={this.props.settings.plot.configs}
                />
            </div>
        );
    }
}

export default connect(mapStateToProps)(PlotComponent);

