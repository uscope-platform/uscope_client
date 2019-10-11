import {LOAD_REGISTERS, SEND_REGISTER} from "../Actions/types";
import produce from "immer";

let registerValuesReducer = function (state = {}, action) {
    switch (action.type) {
        case LOAD_REGISTERS:
            return produce(state, draftState => {
                draftState[action.payload.peripheral] = action.payload.value;
            });
        case SEND_REGISTER:
            return produce(state, draftState => {
                draftState[action.payload.peripheral][action.payload.name] = action.payload.value;
            });
        default:
            return state;
    }
};

export default registerValuesReducer;
