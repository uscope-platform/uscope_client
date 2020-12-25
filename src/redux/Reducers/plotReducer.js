import {
    SET_CHANNEL_STATUS,
    FETCH_DATA,
    LOAD_CHANNELS,
    PLOT_PAUSE,
    PLOT_PLAY,
    PLOT_STOP,
    SET_CHANNEL_SETTING, INITIALIZE_CHANNELS
} from "../Actions/types";
import produce from "immer";


let base_data = [];

// eslint-disable-next-line
for(let i = 0; i<6;i++){
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
            return produce(state, draftState =>{
                draftState['data'] = action.payload;
                draftState['datarevision'] += 1;
            });
        case SET_CHANNEL_STATUS:
            return produce(state, draftState => {
                let chs = action.payload.channel
                draftState['data'] = draftState['data'].filter(item=>{
                    if(item.spec.id in chs){
                        let new_item = item;
                        new_item.visible = chs[item.spec.id];
                        return new_item;
                    } else {
                        return item
                    }
                })
                chs = draftState['data'];
                draftState['datarevision'] += 1;
            });
        case LOAD_CHANNELS:
            return produce(state, draftState => {
                draftState['settings'] = action.payload;
                draftState['loading_done'] = true;
            });

        case FETCH_DATA:
            return produce(state, draftState => {
                debugger;
                for(let channel_payload of action.payload){
                    console.log(channel_payload.channel)
                    for(let item of draftState['data']){
                        if(parseInt(item.spec.number)===channel_payload.channel){
                            console.log(parseInt(item.spec.number))
                            console.log('===')
                            console.log(channel_payload.channel)
                            item.y = channel_payload.data;
                        }

                    }
                }
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
