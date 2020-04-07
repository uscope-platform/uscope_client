import {
    ENABLE_CHANNEL,
    DISABLE_CHANNEL,
    LOAD_CHANNELS,
    PLOT_PLAY,
    PLOT_PAUSE,
    PLOT_STOP,
    FETCH_DATA,
    SET_CHANNEL_SETTING
} from "./types";
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

export const loadChanels = (server_url, config) => {
    return dispatch => {
        axios.get(server_url, config).then(res => {
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

export const plotPlay = () =>{
    return{
        type: PLOT_PLAY,
        payload:{
            value: true
        }
    }
};

export const plotPause = () =>{
    return{
        type: PLOT_PAUSE,
        payload:{
            value: false
        }
    }
};

export const plotStop = () =>{
    return{
        type: PLOT_STOP,
        payload:{
            value: false
        }
    }
};

export const setChannelSetting = (server_url, settings, config) => {
    return dispatch => {
        axios.post(server_url, settings, config).then(res => {
            dispatch(setChannelSettingDone(settings));
        }).catch(err => {
            alert(err.message);
        });
    };
};

export const setChannelSettingDone = (settings) =>({
    type: SET_CHANNEL_SETTING,
    payload: settings
});


export const fetchData = (server_url, channels, config) => {
    return dispatch => {

        let options = {
            params: {
                channels: JSON.stringify(channels)
            }
        };

        options = {...options, config};
        axios.get(server_url, options).then(res => {
            dispatch(fetchDataDone(res.data));
        }).catch(err => {
            alert(err.message);
        });
    };
};

export const fetchDataDone = data =>({
    type: FETCH_DATA,
    payload: data
});
