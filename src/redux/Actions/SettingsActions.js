import {SET_SETTING} from "./types";


export const setSetting = (setting) =>{
    return{
        type: SET_SETTING,
        payload:{
            name: setting[0],
            value: setting[1]
        }
    }
};
