import {EDIT_PERIPHERAL, LOAD_PERIPHERALS, REMOVE_PERIPHERAL} from "../Actions/types";
import produce from "immer";


let PeripheralsReducer = function (state = null, action) {
    switch (action.type) {
        case LOAD_PERIPHERALS:
            state = action.payload;
            return state;
        case EDIT_PERIPHERAL:
            return produce(state, draftState => {
                let reg = draftState[action.payload.peripheral]["registers"].filter((item)=>{
                    return item.register_name===action.payload.register;
                })[0];
                reg[action.payload.field] = action.payload.value;
               return draftState
            });
        case REMOVE_PERIPHERAL:
            return produce(state, draftState => {
                delete draftState[action.payload];
            });
        default:
            return state;
    }
};

export default PeripheralsReducer;
