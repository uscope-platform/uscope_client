import {
    ENABLE_CHANNEL,
    DISABLE_CHANNEL,
    LOAD_CHANNELS,
    PLOT_PLAY,
    PLOT_PAUSE,
    PLOT_STOP,
    FETCH_DATA
} from "../Actions/types";
import produce from "immer";


let channelStatusReducer = function (state = null, action) {
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
            });

        case FETCH_DATA:
            return produce(state, draftState => {
                draftState['data'][action.payload.channel]['y'] = action.payload.value;
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
                    debugger;
                    return {
                        ...channel,
                        visible: false
                    }
                });
                draftState['datarevision'] += 1;
            });

        default:
            return state;
    }
};

export default channelStatusReducer;