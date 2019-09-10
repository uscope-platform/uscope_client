import {ENABLE_CHANNEL, DISABLE_CHANNEL, LOAD_CHANNELS} from "./types";
import axios from "axios";


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

export const loadChanels = (server_url) => {
    return dispatch => {
        axios.get(server_url).then(res => {
            dispatch(loadChanelsDone(res.data));
        }).catch(err => {
            alert(err.message);
        });
    };
};

const loadChanelsDone = channels => ({
    type: LOAD_CHANNELS,
    payload: channels
});
