import React from 'react';

import Container from "react-bootstrap/Container";


let  PlotControls= props =>{

    let onClick = () => {
        console.log("controlled");
    };

    return(
        <Container>
            {props.controls.map((control) => {
                return(
                    <img className={"plot_controls_asset"} src={control.image} alt={control.name} onClick={onClick} />
                );
            })}
        </Container>
    );
};

export default PlotControls;
