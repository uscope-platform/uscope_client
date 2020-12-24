import {
    SET_CHANNEL_STATUS,
    FETCH_DATA,
    LOAD_CHANNELS,
    PLOT_PAUSE,
    PLOT_PLAY,
    PLOT_STOP,
    SET_CHANNEL_SETTING, INITIALIZE_CHANNELS
} from "./types";
import axios from "axios";


export const setChannelStatus = (server_url, status, config) =>{
    return dispatch => {
        axios.post(server_url,status, config).then(res => {
            dispatch(setChannelStatusDone(status));
        }).catch(err => {
            alert(err.message);
        });
    };
}

const setChannelStatusDone = (status) =>{
    return{
        type: SET_CHANNEL_STATUS,
        payload:{
            channel: status,
            enabled: true
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

export const initialize_channels = (data) =>{
    return{
        type: INITIALIZE_CHANNELS,
        payload: data
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


export const fetchData = (server_url, config) => {
    return dispatch => {
        axios.get(server_url, config).then(res => {
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
