import {SAVE_SCRIPTS} from "./types";


export const saveScripts = (scripts) => ({
    type: SAVE_SCRIPTS,
    payload:scripts
});

