import { SAVE_SCRIPTS, SAVE_SCRIPT_WORKSPACE} from "../Actions/types";



let scriptsReducer = function (state = [], action) {
    switch (action.type) {
        case SAVE_SCRIPTS:
                state = action.payload;
                return  state;
        default:
            return state;
    }
};


let scriptsWorkspaceReducer = function(state=null, action) {
    switch (action.type) {
        case SAVE_SCRIPT_WORKSPACE:
            state = {...state, ...action.payload};
            return state;
        default:
            return state;
    }
};


export  {scriptsReducer, scriptsWorkspaceReducer};
