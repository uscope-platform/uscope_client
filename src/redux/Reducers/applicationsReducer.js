import {LOAD_APPLICATIONS, REMOVE_APPLICATION} from "../Actions/types";
import produce from "immer";


let ApplicationsReducer = function (state = [], action) {
    switch (action.type) {
        case LOAD_APPLICATIONS:
            state = action.payload;
            return state;
        case REMOVE_APPLICATION:
            return produce(state, draftState => {
                delete draftState[action.payload];
            });
        default:
            return state;
    }
};

export default ApplicationsReducer;
