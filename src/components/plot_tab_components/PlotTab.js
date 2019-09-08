import React from 'react';
import {useSelector} from "react-redux";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col";

import ChannelSelector from "./ChannelSelector";
import PlotComponent from "./PlotComponent";
import ParametersArea from "./ParametersArea";
import PlotControls from "./PlotControls";




let PlotTab = function (props) {
    const channels = useSelector(state => state.channelStatus)

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
            <Container>
                <Row>
                    <Col md={3}>
                        <ChannelSelector channels={channels}/>
                    </Col>
                    <Col md={8}>
                        <Row>
                            <Col>
                                <PlotComponent/>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <ParametersArea/>
                            </Col>
                        </Row>
                    </Col>
                    <Col md={1}>
                        <PlotControls controls={controls}/>
                    </Col>
                </Row>

            </Container>
        );
};

export default PlotTab;
