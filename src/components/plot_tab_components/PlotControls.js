import React, {Component} from 'react';

import Container from "react-bootstrap/Container";


class PlotControls extends Component {

    onClick(){
        console.log("controlled");
    }

    render() {
        return(
            <Container>
                {this.props.controls.map((control) => {
                    return(
                        <img className={"plot_controls_asset"} src={control.image} alt={control.name} onClick={this.onClick} />
                    );
                })}
            </Container>
        );
    }

}

export default PlotControls;
