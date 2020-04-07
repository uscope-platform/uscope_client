import {LOAD_ALL_SCRIPTS, SAVE_SCRIPT_WORKSPACE, ADD_SCRIPT, REMOVE_SCRIPT, EDIT_SCRIPT} from "./types";
import axios from "axios";



export const saveScriptsWorkspace = (workspace) => ({
    type: SAVE_SCRIPT_WORKSPACE,
    payload:workspace
});


export const addScript = (server_url, script, config) =>{
    return dispatch => {
        axios.post(server_url, script, config).then(res => {
            dispatch(AddScriptDone(script));
        }).catch(err => {
            alert(err.message);
        });
    };
};

const AddScriptDone = script =>({
    type: ADD_SCRIPT,
    payload:script
});


export const editScript = (server_url, script, config) =>{
    return dispatch => {
        axios.patch(server_url,script, config).then(res => {
            dispatch(editScriptDone(script));
        }).catch(err => {
            alert(err.message);
            dispatch(editScriptDone(script));
        });
    };
};

const editScriptDone = script =>({
    type: EDIT_SCRIPT,
    payload:script
});

export const removeScript = (server_url, script, config) =>{
    return dispatch => {
        axios.delete(server_url, config).then(res => {
            dispatch(removeScriptDone(script));
        }).catch(err => {
            alert(err.message);
        });
    };
};

const removeScriptDone = script =>({
    type: REMOVE_SCRIPT,
    payload:script
});


export const loadAllScripts = (server_url, config) =>{
    return dispatch => {
        axios.get(server_url, config).then(res => {
            dispatch(loadAllScriptsDone(res.data));
        }).catch(err => {
            alert(err.message);
        });
    };
};

const loadAllScriptsDone = script =>({
    type: LOAD_ALL_SCRIPTS,
    payload:script
});
