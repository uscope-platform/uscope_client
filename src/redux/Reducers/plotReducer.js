import {
    ENABLE_CHANNEL,
    DISABLE_CHANNEL,
    LOAD_CHANNELS,
    PLOT_PLAY,
    PLOT_PAUSE,
    PLOT_STOP,
    FETCH_DATA, SET_CHANNEL_SETTING, SET_TIMEBASE
} from "../Actions/types";
import produce from "immer";


let plotReducer = function (state = null, action) {
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
        case SET_TIMEBASE:
            return produce(state, draftState =>{
                draftState["timebase"] = action.payload;
            });
        default:
            return state;
    }
};

export default plotReducer;
