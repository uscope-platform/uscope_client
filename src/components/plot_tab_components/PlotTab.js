import React from 'react';
import {useSelector} from "react-redux";

import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col";

import ChannelSelector from "./ChannelSelector";
import PlotComponent from "./PlotComponent";
import ParametersArea from "./ParametersArea";
import PlotControls from "./PlotControls";




let PlotTab = function (props) {
    const channels = useSelector(state => state.channelStatus);
    const settings = useSelector(state => state.settings);
    let controls = [
        {
            name:"play",
            image:"assets/Icons/play.svg"
        },
        {
            name:"pause",
            image:"assets/Icons/pause.svg"
        },
        {
            name:"stop",
            image:"assets/Icons/stop.svg"
        },
        {
            name:"timebase",
            image:"assets/Icons/timebase.svg"
        },
        {
            name:"mode",
            image:"assets/Icons/mode.svg"
        },

    ];

        return(
            <Row>
                <Col md={3} className="plot_channel_selector_container">
                    <ChannelSelector channels={channels}/>
                </Col>
                <Col md={8}>
                    <Row>
                        <PlotComponent refreshRate={settings.refreshRate} />
                    </Row>
                    <Row>
                        <ParametersArea server={props.server}/>
                    </Row>
                </Col>
                <Col md={1} className="plot_controls_container">
                    <PlotControls controls={controls}/>
                </Col>
            </Row>
        );
};

export default PlotTab;
