import {LOAD_PERIPHERALS, REMOVE_PERIPHERAL} from "../Actions/types";
import produce from "immer";


let PeripheralsReducer = function (state = null, action) {
    switch (action.type) {
        case LOAD_PERIPHERALS:
            state = action.payload;
            return state;
        case REMOVE_PERIPHERAL:
            return produce(state, draftState => {
                delete draftState[action.payload];
            });
        default:
            return state;
    }
};

export default PeripheralsReducer;
