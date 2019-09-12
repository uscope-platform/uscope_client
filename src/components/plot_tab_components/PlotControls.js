import React from 'react';

import Container from "react-bootstrap/Container";
import {useDispatch} from "react-redux";
import {plotPause, plotPlay, plotStop} from "../../redux/Actions/ChannelStatusActions";
import TimebaseModal from "../Modal_Components/TimebaseModal"


let  PlotControls = props =>{
    let display_modal = false;

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
            case "timebase":
                display_modal = true;

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
