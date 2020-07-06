import React, {Component} from 'react';

import Plotly from 'plotly.js-dist';
import createPlotlyComponent from 'react-plotly.js/factory';
import {connect} from "react-redux";
import styled from "styled-components";
import PlotControls from "./PlotControls";
const Plot = createPlotlyComponent(Plotly);



function mapStateToProps(state) {
    return{
        channels:state.plot,
        settings:state.settings,
    }
}

const ComponentStyle = styled.div`
  display: grid;
  grid-template-columns: auto auto;
  grid-auto-rows: auto;
  grid-row-gap: 1em;
`

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
            <ComponentStyle>
                <Plot
                    data={this.props.channels.data}
                    layout={this.props.channels.layout}
                    config={this.props.channels.configs}
                    datarevision={this.props.datarevision}
                />
                <PlotControls server={this.props.server} />
            </ComponentStyle>
        );
    }
}

export default connect(mapStateToProps)(PlotComponent);

