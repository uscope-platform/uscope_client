import {
    ENABLE_CHANNEL,
    DISABLE_CHANNEL,
    LOAD_CHANNELS,
    PLOT_PLAY,
    PLOT_PAUSE,
    PLOT_STOP,
    FETCH_DATA,
    SET_CHANNEL_SETTING
} from "../Actions/types";
import produce from "immer";


let base_data = [];

// eslint-disable-next-line
for(let i = 0; i<7;i++){
    base_data.push({
        x: Array.from(Array(1024).keys()),
        y:  Array(1024).fill(0),
        type: 'scatter',
        mode: 'lines',
        name: 'channel_'+ i,
        visible: false
    });
}


const initial_state = {
    data:base_data,
        loading_done:false,
        plot_running:false,
        datarevision:0,
        parameters:{
        memory_depth: 1024
    },
    layout: {
        width: "1024",
            height: "auto",
            title: 'A Fancy Plot',
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
        case ENABLE_CHANNEL:
            return produce(state, draftState => {
                draftState['data'][action.payload.channel]['visible'] = action.payload.enabled;
                draftState['datarevision'] += 1;
            });
        case DISABLE_CHANNEL:
            return produce(state, draftState => {
                draftState['data'][action.payload.channel]['visible'] = action.payload.enabled;
                draftState['datarevision'] += 1;
            });
        case LOAD_CHANNELS:
            return produce(state, draftState => {
                draftState['settings'] = action.payload;
                draftState['loading_done'] = true;
            });

        case FETCH_DATA:
            return produce(state, draftState => {
                draftState['data'][action.payload.channel]['y'] = action.payload.data;
                draftState['datarevision'] += 1;
            });

        case PLOT_PLAY:
            return produce(state, draftState => {
                draftState["plot_running"] = action.payload.value;
            });
        case PLOT_PAUSE:
            return produce(state, draftState => {
                draftState["plot_running"] = action.payload.value;
            });
        case PLOT_STOP:
            return produce(state, draftState => {
                draftState["plot_running"] = action.payload.value;
                draftState['data'] = draftState['data'].map((channel)=>{
                    return {
                        ...channel,
                        visible: false
                    }
                });
                draftState['datarevision'] += 1;
            });
        case SET_CHANNEL_SETTING:
            return produce(state, draftState =>{
                // eslint-disable-next-line
                for(let s of action.payload){
                    draftState['settings'][s.channel_id][s.name] = s.value;
                }
            });
        default:
            return state;
    }
};

export default plotReducer;
