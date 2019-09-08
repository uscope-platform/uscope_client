import {SET_SETTING} from "../Actions/types";
import produce from "immer";


let settingsReducer = function (state = null, action) {
    switch (action.type) {
        case SET_SETTING:
            return produce(state, draftState => {
                draftState[action.payload.name] = action.payload.value;
            });
        default:
            return state;
    }
};

export default settingsReducer;
