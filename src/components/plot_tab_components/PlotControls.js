import React from 'react';

import {useDispatch, useSelector} from "react-redux";
import {Camera, Configure, Pause, Play, Stop} from 'grommet-icons'
import {plotPause, plotPlay, plotStop} from "../../redux/Actions/plotActions";
import TimebaseModal from "../Modal_Components/TimebaseModal"
import ScopeModeModal from "../Modal_Components/scopeModeModal";
import {showModal} from "../../redux/Actions/modalsActions";
import styled from "styled-components";


const ComponentStyle = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 2.75rem;
`

const IconStyle = styled.div`
  flex: 0 0 2rem;
  
`


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
    };

    let onModeSubmit = (capture_length) => {
        props.server.plot_proxy.setCapture(capture_length);
        setTimeout(onCaptureEnd, 1000);
    };


    let onCaptureEnd = () => {
        props.server.plot_proxy.get_captured_data().then((res) => {
            if(res['elapsed'] !== 0){
                setTimeout(onCaptureEnd, 500);
            } else {
                let hiddenElement = document.createElement('a');
                hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(res['data']);
                hiddenElement.target = '_blank';
                hiddenElement.download = 'data.csv';
                hiddenElement.click();
            }
        });
    };

    return(
        <ComponentStyle>
            <TimebaseModal server={props.server} show={modals.timebase_choice}/>
            <ScopeModeModal server={props.server} show={modals.scope_mode_choice} done={onModeSubmit} />
            <IconStyle>
                <Play id='play' color='white' onClick={onClick}/>
            </IconStyle>

            <IconStyle>
                <Pause id='pause' color='white' onClick={onClick}/>
            </IconStyle>

            <IconStyle>
                <Stop id='stop' color='white' onClick={onClick}/>
            </IconStyle>

            <IconStyle>
                <Configure id='timebase' color='white' onClick={onClick}/>
            </IconStyle>

            <IconStyle>
                <Camera id='mode' color='white' onClick={onClick}/>
            </IconStyle>

        </ComponentStyle>
    );
};

export default PlotControls;
