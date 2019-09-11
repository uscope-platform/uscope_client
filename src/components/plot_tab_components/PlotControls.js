import React from 'react';

import Container from "react-bootstrap/Container";
import {useDispatch} from "react-redux";
import {plotPause, plotPlay, plotStop} from "../../redux/Actions/PlotActions";

let  PlotControls= props =>{
    const dispatch = useDispatch();

    let onClick = (event) => {
        switch (event.target.id) {
            case "play":
                dispatch(plotPlay());
                break;
            case "pause":
                dispatch(plotPause());
                break;
            case "stop":
                dispatch(plotStop());
                break;
            default:
                break;
        }
        console.log("controlled");
    };

    return(
        <Container>
            {props.controls.map((control, i) => {
                return(
                    <img className={"plot_controls_asset"} key={i} src={control.image} alt={control.name} id={control.name} onClick={onClick} />
                );
            })}
        </Container>
    );
};

export default PlotControls;
