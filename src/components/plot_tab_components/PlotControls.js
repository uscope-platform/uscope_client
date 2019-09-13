import React from 'react';

import {useDispatch, useSelector} from "react-redux";
import {plotPause, plotPlay, plotStop} from "../../redux/Actions/plotActions";
import TimebaseModal from "../Modal_Components/TimebaseModal"
import {hideModal, showModal} from "../../redux/Actions/modalsActions";


let  PlotControls = props =>{
    const modals = useSelector(state => state.modals);
    const plot = useSelector(state => state.plot);
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
            default:
                break;
        }
        console.log("controlled");
    };

    let onModalSubmit = (event) =>{
        let value = event.replace(' ', '');

        let numeric_value = 0;
        if(isNaN(parseFloat(value[value.length -1]))){
            numeric_value = value.slice(0,value.length-1);
            switch (value[value.length-1]) {
                case 'M':
                    numeric_value = numeric_value*1e6;
                    break;
                case 'k':
                case 'K':
                    numeric_value = numeric_value*1e3;
                    break;
                case 'm':
                    numeric_value = numeric_value*1e-3;
                    break;
                case 'u':
                case 'U':
                    numeric_value = numeric_value*1e-6;
                    break;
                default:
                    break;
            }
        } else{
            numeric_value = parseFloat(value);
        }

        let sample_time =  numeric_value/plot.parameters.memory_depth;
        props.server.app_proxy.setApplicationParameters({name:'uscope_timebase_change',value:sample_time});
        debugger;
        dispatch(hideModal("timebase_choice"));
    };

    return(
        <div>
            <TimebaseModal done={onModalSubmit} show={modals.timebase_choice}/>
            {props.controls.map((control, i) => {
                return(
                    <img className={"plot_controls_asset"} key={i} src={control.image} alt={control.name} id={control.name} onClick={onClick} />
                );
            })}
        </div>
    );
};

export default PlotControls;
