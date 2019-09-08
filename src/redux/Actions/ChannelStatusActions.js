import {ENABLE_CHANNEL, DISABLE_CHANNEL} from "./types";


export const enableChannel = (channel_name) =>{
    return{
        type: ENABLE_CHANNEL,
        payload:{
            name: channel_name,
            enabled: true
        }
    }
};

export const disableChannel = (channel_name) =>{
    return {
        type: DISABLE_CHANNEL,
        payload:{
            name: channel_name,
            enabled: false
        }
    }
};
