import {SAVE_SCRIPT_WORKSPACE, ADD_SCRIPT, REMOVE_SCRIPT, LOAD_ALL_SCRIPTS, EDIT_SCRIPT} from "../Actions/types";
import produce from "immer";




let scriptsReducer = function (state = [], action) {
    switch (action.type) {
        case ADD_SCRIPT:
            return produce(state, draftState => {
                draftState.push(action.payload);
            });
        case REMOVE_SCRIPT:
            return state.filter((elem)=>{
                return JSON.stringify(elem) !== JSON.stringify(action.payload);
            });
        case LOAD_ALL_SCRIPTS:
            state = action.payload;
            return  state;
        case EDIT_SCRIPT:
            return produce(state, draftState => {
                debugger;
                let current_state = draftState.find(x => x.id === action.payload.id);
                let index = draftState.indexOf(current_state);
                draftState.splice(index, 1);
                draftState.push(action.payload)

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
