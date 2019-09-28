import {LOAD_TABS} from "../Actions/types";


let tabsReducer = function (state = null, action) {
    switch (action.type) {
        case LOAD_TABS:
            state =  [...state, ...action.payload];
            return state;
        default:
            return state;
    }
};

export default tabsReducer;
