import {ADD_SCRIPT, EDIT_SCRIPT, LOAD_ALL_SCRIPTS, REMOVE_SCRIPT, SAVE_SCRIPT_WORKSPACE} from "../Actions/types";
import produce from "immer";


let scriptsReducer = function (state = [], action) {
    switch (action.type) {
        case ADD_SCRIPT:
            return produce(state, draftState => {
                draftState[action.payload.id] = action.payload;
            });
        case REMOVE_SCRIPT:
            return produce(state, draftState => {
                delete draftState[action.payload.id];
            });
        case LOAD_ALL_SCRIPTS:
            state = action.payload;
            return  state;
        case EDIT_SCRIPT:
            return produce(state, draftState => {
                draftState[action.payload.script][action.payload.field] = action.payload.value;
            });
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
