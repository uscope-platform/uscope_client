import {LOAD_TABS} from "./types";


export const loadTabs = (tabs) =>{
    return{
        type: LOAD_TABS,
        payload:tabs
    }
};
