import {LOAD_VIEWS} from "./types";


export const loadViews = (views) =>{
    return{
        type: LOAD_VIEWS,
        payload:views
    }
};
