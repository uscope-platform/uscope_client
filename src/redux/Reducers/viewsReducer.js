import {LOAD_VIEWS} from "../Actions/types";


let viewsReducer = function (state = [], action) {
    switch (action.type) {
        case LOAD_VIEWS:
            state =  [...state, ...action.payload];
            return state;
        default:
            return state;
    }
};

export default viewsReducer;
