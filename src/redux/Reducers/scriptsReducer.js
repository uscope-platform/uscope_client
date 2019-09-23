import { SAVE_SCRIPTS} from "../Actions/types";



let scriptsReducer = function (state = null, action) {
    switch (action.type) {
        case SAVE_SCRIPTS:
                state = action.payload;
                return  state;
        default:
            return state;
    }
};

export default scriptsReducer;
