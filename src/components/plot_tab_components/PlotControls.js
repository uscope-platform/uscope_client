import React, {useState} from 'react';

import {useDispatch, useSelector} from "react-redux";
import {Pause, Play, Stop} from 'grommet-icons'
import {plotPause, plotPlay, plotStop} from "../../redux/Actions/plotActions";
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
    const settings = useSelector(state => state.settings);
    const applications = useSelector(state => state.applications);

    const [timebase_addr, ] = useState(applications[settings['application']]['timebase_address']);

    const dispatch = useDispatch();
    let onClick = (event) => {
        switch (event.target.id) {
            case "play":
                let address = parseInt(timebase_addr);
                let bulk_registers = []
                bulk_registers.push({address:address, value:1})
                settings.server.periph_proxy.bulkRegisterWrite({payload:bulk_registers});
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
    };


    return(
        <ComponentStyle>
            <IconStyle>
                <Play id='play' color='white' onClick={onClick}/>
            </IconStyle>

            <IconStyle>
                <Pause id='pause' color='white' onClick={onClick}/>
            </IconStyle>

            <IconStyle>
                <Stop id='stop' color='white' onClick={onClick}/>
            </IconStyle>
        </ComponentStyle>
    );
};

export default PlotControls;
