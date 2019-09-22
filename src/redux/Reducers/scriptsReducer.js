import {LOAD_SCRIPTS, SAVE_SCRIPT} from "../Actions/types";
import produce from "immer";


let scriptsReducer = function (state = null, action) {
    switch (action.type) {
        case LOAD_SCRIPTS:
            state = action.payload;
            break;
        case SAVE_SCRIPT:
            return produce(state, draftState => {
                draftState.push(action.payload);
            });
        default:
            return state;
    }
};

export default scriptsReducer;
