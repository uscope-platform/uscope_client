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

import React, {useEffect} from 'react';

import ChannelSelectorItem from "./ChannelSelectorItem";
import {useSelector} from "react-redux";
import {ColorTheme} from "../UI_elements";
import {setSetting} from "../../redux/Actions/SettingsActions";
import {useDispatch} from "react-redux";

import {set_channel_status, get_channel_number_from_id} from "../../client_core";
import PlotControls from "./PlotControls";
import {plotPause, plotPlay, plotStop} from "../../redux/Actions/plotActions";


let ChannelSelector = function(props) {

    const settings = useSelector(state => state.settings);
    const channels = useSelector(state => state.plot);
    const dispatch = useDispatch();

    useEffect(()=>{
        let new_ch_state = get_state();
        set_channel_status(new_ch_state);
    },[])

    let get_state = ()=>{
        let new_ch_state = {}
        channels.data.map(chan => {
            new_ch_state[chan.spec.number] = chan.visible;
            return 0;
        })
        return new_ch_state;
    }

    let handle_status_change = status =>{
        let new_state = get_state();
        let channel_number = get_channel_number_from_id(status.id, channels.data);
        new_state[parseInt(channel_number)] = status.status;
        set_channel_status(new_state);

        let palette = [];
        for(let item in new_state){

            if(new_state[item]){
                palette.push(ColorTheme.plot_palette[parseInt(item)]);
            }
        }
        dispatch(setSetting(["plot_palette", {colorway: palette}]));
    }

    let handle_play = ()=>{
        dispatch(plotPlay());
    }
    let handle_pause = ()=>{
        dispatch(plotPause());
    }
    let handle_stop = ()=>{
        dispatch(plotStop());
    }

    let handle_download = () =>{
        let data = channels.data.map((ch)=>{
            return ch.y;
        });
        let csv_content = "";
        if(settings.sampling_period){
            csv_content = `time,${channels.data[0].name},${channels.data[1].name},${channels.data[2].name},${channels.data[3].name},${channels.data[4].name},${channels.data[5].name}\n`
            for(let i = 0; i<data[0].length; i++){

                csv_content += `${channels.data[0].x[i]/settings.sampling_period},${data[0][i]},${data[1][i]},${data[2][i]},${data[3][i]},${data[4][i]},${data[5][i]}\n`
            }
        } else {
            csv_content = `${channels.data[0].name},${channels.data[1].name},${channels.data[2].name},${channels.data[3].name},${channels.data[4].name},${channels.data[5].name}\n`
            for(let i = 0; i<data[0].length; i++){

                csv_content += `${data[0][i]},${data[1][i]},${data[2][i]},${data[3][i]},${data[4][i]},${data[5][i]}\n`
            }
        }


        let [month, day, year]    = new Date().toLocaleDateString("en-US").split("/");
        let [hour, minute, second] = new Date().toLocaleTimeString("en-US").split(/:| /);
        let filename = settings.default_ch_group.group_name.replace(' ', '_')+ '_'+ day+month+year+hour+minute+second;

        const encodedUri = encodeURI('data:text/csv;charset=utf-8,' + csv_content);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", filename);
        link.setAttribute("id", "csv_download_link");
        document.body.appendChild(link);

        link.click();
        link.remove();

    }

    return(
            <div>
                    {channels.data.map((chan,i) => {
                        return(
                            <ChannelSelectorItem onStatusChange={handle_status_change} key={chan.spec.id} id={chan.spec.id} idx={i} name={chan.spec.name} value={chan.visible}/>
                        );
                    })}
                <PlotControls onPlay={handle_play} onPause={handle_pause} onStop={handle_stop} onDownload={handle_download}/>
            </div>
        );
};

export default ChannelSelector;
