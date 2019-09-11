import {PLOT_PLAY, PLOT_PAUSE, PLOT_STOP, FETCH_DATA} from "../Actions/types";
import produce from "immer";


let plotReducer = function (state = null, action) {
    switch (action.type) {
        case PLOT_PLAY:
            return produce(state, draftState => {
                draftState[action.payload.name] = action.payload.value;
            });
        case PLOT_PAUSE:
            return produce(state, draftState => {
                draftState[action.payload.name] = action.payload.value;
            });
        case PLOT_STOP:
            return produce(state, draftState => {
                draftState[action.payload.name] = action.payload.value;
            });
        case FETCH_DATA:
            return produce(state, draftState => {
                draftState['data'][action.payload.channel]['y'] = action.payload.value;
            });
        default:
            return state;
    }
};

export default plotReducer;
