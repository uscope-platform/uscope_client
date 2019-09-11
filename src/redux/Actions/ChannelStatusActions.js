import {ENABLE_CHANNEL, DISABLE_CHANNEL, LOAD_CHANNELS} from "./types";
import axios from "axios";


export const enableChannel = (channel) =>{
    return{
        type: ENABLE_CHANNEL,
        payload:{
            channel: channel,
            enabled: true
        }
    }
};

export const disableChannel = (channel) =>{
    return {
        type: DISABLE_CHANNEL,
        payload:{
            channel: channel,
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

