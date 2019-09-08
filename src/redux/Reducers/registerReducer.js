import {SET_SINGLE_VALUE_REGISTER, SET_TWO_VALUE_REGISTER} from "../Actions/types";
import produce from "immer";

let registerValuesReducer = function (state = null, action) {

    switch (action.type) {
        case SET_SINGLE_VALUE_REGISTER:
            return produce(state, draftState => {
                let index =  draftState[action.payload.peripheral].findIndex((obj => obj.qualified_name === action.payload.name));
                draftState[action.payload.peripheral][index]["value"] = action.payload.value;
            });
        case SET_TWO_VALUE_REGISTER:
            return produce(state, draftState => {
                let index =  draftState[action.payload.peripheral].findIndex((obj => obj.qualified_name === action.payload.name));
                draftState[action.payload.peripheral][index]["value"] = action.payload.value;
            });
        default:
            return state;
    }
};

export default registerValuesReducer;
