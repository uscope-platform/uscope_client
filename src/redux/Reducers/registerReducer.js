import {LOAD_REGISTERS, SEND_REGISTER} from "../Actions/types";
import produce from "immer";

let registerValuesReducer = function (state = null, action) {
    switch (action.type) {
        case LOAD_REGISTERS:
            return produce(state, draftState => {
                draftState[action.payload.peripheral] = action.payload.value;
            });
        case SEND_REGISTER:
            return produce(state, draftState => {
                let index =  draftState[action.payload.peripheral].findIndex((obj => obj.register_name === action.payload.name));
                draftState[action.payload.peripheral][index]["value"] = action.payload.value;
            });
        default:
            return state;
    }
};

export default registerValuesReducer;
