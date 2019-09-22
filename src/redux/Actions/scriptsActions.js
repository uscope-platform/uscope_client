import {SAVE_SCRIPT, LOAD_SCRIPTS} from "./types";


export const saveScript = (script) => ({
    type: SAVE_SCRIPT,
    payload:script
});

export const LoadScripts = (scripts) => ({
    type: LOAD_SCRIPTS,
    payload: scripts
});
