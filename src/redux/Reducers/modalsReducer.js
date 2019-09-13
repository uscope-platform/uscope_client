import {SHOW_MODAL, HIDE_MODAL} from "../Actions/types";
import produce from "immer";



let modalsReducer = function (state = null, action) {
    switch (action.type) {
        case SHOW_MODAL:
            return produce(state, draftState => {
                if(action.payload.idx===-1){
                    draftState[action.payload.name] = action.payload.value;
                } else{
                    draftState[action.payload.name][action.payload.idx] = action.payload.value;
                }
            });
        case HIDE_MODAL:
            return produce(state, draftState => {
                if(action.payload.idx===-1){
                    draftState[action.payload.name] = action.payload.value;
                } else{
                    draftState[action.payload.name][action.payload.idx] = action.payload.value;
                }
            });
        default:
            return state;
    }
};

export default modalsReducer;
