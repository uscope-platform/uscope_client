import React, {Component} from 'react';

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col";

import ChannelSelector from "./ChannelSelector";
import PlotComponent from "./PlotComponent";
import ParametersArea from "./ParametersArea";
import PlotControls from "./PlotControls";


class PlotTab extends Component {

    controls = [
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

    render() {
        return(
            <Container>
                <Row>
                    <Col md={3}>
                        <ChannelSelector content={this.props.content}/>
                    </Col>
                    <Col md={8}>
                        <Row>
                            <Col>
                                <PlotComponent/>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <ParametersArea parameters={this.props.content.channels}/>
                            </Col>
                        </Row>
                    </Col>
                    <Col md={1}>
                        <PlotControls controls={this.controls}/>
                    </Col>
                </Row>

            </Container>
        );
    }

}

export default PlotTab;
