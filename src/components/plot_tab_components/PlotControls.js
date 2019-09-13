import React from 'react';

import {useDispatch, useSelector} from "react-redux";
import {plotPause, plotPlay, plotStop} from "../../redux/Actions/plotActions";
import TimebaseModal from "../Modal_Components/TimebaseModal"
import ScopeModeModal from "../Modal_Components/scopeModeModal";
import {showModal} from "../../redux/Actions/modalsActions";


let  PlotControls = props =>{
    const modals = useSelector(state => state.modals);
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
                dispatch(showModal("timebase_choice"));
                break;
            case 'mode':
                dispatch(showModal('scope_mode_choice'));
                break;
            default:
                break;
        }
        console.log("controlled");
    };

    return(
        <div>
            <TimebaseModal server={props.server} show={modals.timebase_choice}/>
            <ScopeModeModal server={props.server} show={modals.scope_mode_choice}/>
            {props.controls.map((control, i) => {
                return(
                    <img className={"plot_controls_asset"} key={i} src={control.image} alt={control.name} id={control.name} onClick={onClick} />
                );
            })}
        </div>
    );
};

export default PlotControls;
