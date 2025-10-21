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

import React from 'react';

import {MdDownload, MdPause, MdPlayArrow, MdStop} from 'react-icons/md'
import {styled} from "goober";
import {ColorTheme} from "#UI/index.js";

const ComponentStyle = styled('div')`
  display: flex;
  justify-content: center;
  flex-direction: row;
`

interface PlotControlsProps {
    onPlay?: () => void,
    onPause?: () => void,
    onStop?: () => void,
    onDownload?: () => void,
}

let  PlotControls = (props: PlotControlsProps) =>{

    let onClick = (event: React.MouseEvent<SVGElement, MouseEvent>) => {
        switch (event.currentTarget.id) {
            case "play":
                if(props.onPlay) props.onPlay();
                break;
            case "pause":
                if(props.onPause) props.onPause();
                break;
            case "stop":
                if(props.onStop) props.onStop();
                break;
            case "download":
                if(props.onDownload) props.onDownload();
                break;
            default:
                break;
        }
    };

    let render_controls = () =>{
        let ret = [];
        if(props.onPlay){
            ret.push(<MdPlayArrow key="plot_play_btn" id='play' size={ColorTheme.icons_size} color={ColorTheme.icons_color} onClick={onClick}/>);
        }
        if(props.onPause){
            ret.push(<MdPause key="plot_pause_btn"  id='pause' size={ColorTheme.icons_size} color={ColorTheme.icons_color} onClick={onClick}/>);
        }
        if(props.onStop){
            ret.push(<MdStop key="plot_stop_btn"  id='stop' size={ColorTheme.icons_size} color={ColorTheme.icons_color} onClick={onClick}/>);
        }
        if(props.onDownload){
            ret.push(<MdDownload key="plot_download_btn"  id='download' size={ColorTheme.icons_size} color={ColorTheme.icons_color} onClick={onClick}/>);
        }
        return ret;
    }
    return(
        <ComponentStyle>
            {render_controls()}
        </ComponentStyle>
    );
};

export default PlotControls;
