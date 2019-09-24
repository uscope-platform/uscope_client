import {SAVE_SCRIPTS, SAVE_SCRIPT_WORKSPACE} from "./types";


export const saveScripts = (scripts) => ({
    type: SAVE_SCRIPTS,
    payload:scripts
});

export const saveScriptsWorkspace = (workspace) => ({
    type: SAVE_SCRIPT_WORKSPACE,
    payload:workspace
});

