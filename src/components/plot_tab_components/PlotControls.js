// Copyright 2021 University of Nottingham Ningbo China
// Author: Filippo Savi <filssavi@gmail.com>
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import React, {useState} from 'react';

import {useDispatch, useSelector} from "react-redux";
import {Pause, Play, Stop} from 'grommet-icons'
import {plotPause, plotPlay, plotStop} from "../../redux/Actions/plotActions";
import styled from "styled-components";
import {up_peripheral} from "../../client_core";

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
                up_peripheral.direct_register_write([[address, 1]]).then();
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
