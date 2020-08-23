import {ADD_PROGRAM, EDIT_PROGRAM, LOAD_ALL_PROGRAMS, REMOVE_PROGRAM} from "../Actions/types";
import produce from "immer";

let programsReducer = function (state = [], action) {
    switch (action.type) {
        case ADD_PROGRAM:
            return produce(state, draftState => {
                draftState[action.payload.id] = action.payload;
            });
        case EDIT_PROGRAM:
            return produce(state, draftState => {
                draftState[action.payload.program][action.payload.field] = action.payload.value;
            });
        case REMOVE_PROGRAM:
            return produce(state, draftState => {
                delete draftState[action.payload.id];
            });
        case LOAD_ALL_PROGRAMS:
            state = action.payload;
            return state;
        default:
            return state;
    }
};

export default programsReducer;
