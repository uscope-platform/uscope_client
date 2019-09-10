import React, {Component} from 'react';

import Plotly from 'plotly.js-dist';
import createPlotlyComponent from 'react-plotly.js/factory';
const Plot = createPlotlyComponent(Plotly);

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
                            x: [1, 2, 3],
                            y: [2, 6, 3],
                            type: 'scatter',
                            mode: 'lines+points',
                            marker: {color: 'red'},
                        }
                    ]}
                    layout={ {width: "auto", height: "auto",  title: 'A Fancy Plot', paper_bgcolor:"#444",plot_bgcolor:"#444"} }
                />
            </div>
        );
    }
}


export default PlotComponent;
