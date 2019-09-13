import {SHOW_MODAL, HIDE_MODAL} from "../Actions/types";
import produce from "immer";



let modalsReducer = function (state = null, action) {
    switch (action.type) {
        case SHOW_MODAL:
            return produce(state, draftState => {
                draftState[action.payload.name] = action.payload.value;
            });
        case HIDE_MODAL:
            return produce(state, draftState => {
                draftState[action.payload.name] = action.payload.value;
            });
        default:
            return state;
    }
};

export default modalsReducer;
