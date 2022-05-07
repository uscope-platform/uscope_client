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

import {
    SET_CHANNEL_STATUS,
    FETCH_DATA,
    PLOT_PAUSE,
    PLOT_PLAY,
    PLOT_STOP,
    INITIALIZE_CHANNELS
} from "../Actions/types";


let base_data = [];


const initial_state = {
    data:base_data,
    plot_running:false,
    datarevision:0,
    parameters:{
        memory_depth: 1024
    },
    layout: {
        margin: {
            l: 25,
            r: 25,
            b: 25,
            t: 25,
        },
        width: "1024",
        height: "auto",
        paper_bgcolor: "rgba(0,0,0,0)",
        plot_bgcolor:"#444",
        font: {
        color: '#FFFFFF'
        },
        xaxis: {
            showline: true,
                showgrid: true,
                tickcolor: '#FFFFFF',
                linecolor: '#FFFFFF',
                gridcolor: '#777777'
        },
        yaxis: {
            showline: true,
                showgrid: true,
                tickcolor: '#FFFFFF',
                linecolor: '#FFFFFF',
                gridcolor: '#777777'
        }
    },
    configs: {
        responsive: true,
        displaylogo: false
    },
};

let plotReducer = function (state = initial_state, action) {
    switch (action.type) {
        case INITIALIZE_CHANNELS:
            return {...state, data:action.payload, datarevision: state.datarevision+1}
        case PLOT_PLAY:
            return {...state, plot_running: action.payload.value};
        case PLOT_PAUSE:
            return {...state, plot_running: action.payload.value};
        case PLOT_STOP:
            return {
                ...state,
                plot_running: action.payload.value,
                data: state.data.map((channel)=>{
                    return {
                        ...channel,
                        visible: false
                    }
                }),
                datarevision: state.datarevision+1
            }
        case SET_CHANNEL_STATUS:
            return {
                ...state,
                data: state.data.filter(item=>{
                    if(item.spec.number in action.payload.channel){
                        let new_item = item;
                        new_item.visible = action.payload.channel[item.spec.number];
                        return new_item;
                    } else {
                        return item
                    }
                }),
                datarevision: state.datarevision+1
            }
        case FETCH_DATA:
        return {
            ...state,
            data:state.data.map((item)=>{
                let new_item = item;
                for(let channel_payload of action.payload){
                    if(parseInt(new_item.spec.number)===channel_payload.channel){
                        new_item.y = channel_payload.data;
                    }
                }
                return new_item;
            }),
            datarevision: state.datarevision+1
        }
        default:
            return state;
    }
};

export default plotReducer;
