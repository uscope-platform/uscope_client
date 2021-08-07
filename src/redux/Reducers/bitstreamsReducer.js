import {ADD_BITSTREAM, EDIT_BITSTREAM, LOAD_ALL_BITSTREAMS, REMOVE_BITSTREAM} from "../Actions/types";
import produce from "immer";


let BitstreamsReducer = function (state = [], action) {
    switch (action.type) {
        case ADD_BITSTREAM:
            return produce(state, draftState => {
                draftState[action.payload.id] = action.payload;
            });
        case REMOVE_BITSTREAM:
            return produce(state, draftState => {
                delete draftState[action.payload.id];
            });
        case LOAD_ALL_BITSTREAMS:
            state = action.payload;
            return  state;
        case EDIT_BITSTREAM:
            return produce(state, draftState => {
                draftState[action.payload.id][action.payload.field.name] = action.payload.field.value;
            });
        default:
            return state;
    }
};


export default BitstreamsReducer;
