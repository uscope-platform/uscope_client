import {SET_SETTING} from "../Actions/types";
import produce from "immer";

const initial_state = {
    default_tab: "Plot",
        refreshRate: 90
};

let settingsReducer = function (state = initial_state, action) {
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
