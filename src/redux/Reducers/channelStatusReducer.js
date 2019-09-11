import {ENABLE_CHANNEL, DISABLE_CHANNEL, LOAD_CHANNELS} from "../Actions/types";
import produce from "immer";


let channelStatusReducer = function (state = null, action) {
    switch (action.type) {
        case ENABLE_CHANNEL:
            return produce(state, draftState => {
                debugger;
                draftState['data'][action.payload.channel]['visible'] = action.payload.enabled;
            });
        case DISABLE_CHANNEL:
            return produce(state, draftState => {
                draftState['data'][action.payload.channel]['visible'] = action.payload.enabled;
            });
        case LOAD_CHANNELS:
            return produce(state, draftState => {
                draftState['settings'] = action.payload;
            });
        default:
            return state;
    }
};

export default channelStatusReducer;