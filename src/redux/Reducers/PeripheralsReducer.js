import {LOAD_PERIPHERALS} from "../Actions/types";



let PeripheralsReducer = function (state = null, action) {
    switch (action.type) {
        case LOAD_PERIPHERALS:
            state = action.payload;
            return state;
        default:
            return state;
    }
};

export default PeripheralsReducer;
