import {ADD_APPLICATION, LOAD_APPLICATIONS, REMOVE_APPLICATION} from "./types";
import axios from 'axios';


export const loadApplications = (server_url, config) => {

    return dispatch => {
        axios.get(server_url, config).then(res => {
            dispatch(loadApplicationsDone(res.data));
        }).catch(err => {
            alert(err.message);
        });
    };
};

const loadApplicationsDone = parameters => ({
    type: LOAD_APPLICATIONS,
    payload: parameters
});


export const removeApplication = (server_url, application, config) =>{
    return dispatch => {
        axios.get(server_url, config).then(res => {
            dispatch(removeApplicationDone(application));
        }).catch(err => {
            alert(err.message);
        });
    };
};

const removeApplicationDone = application =>({
    type: REMOVE_APPLICATION,
    payload:application
});

export const addApplication = (server_url, application_obj, config) =>{
    return dispatch => {
        axios.post(server_url, application_obj, config).then(res => {
            dispatch(addApplicationDone(application_obj));
        }).catch(err => {
            alert(err.message);
        });
    };
};

const addApplicationDone = application =>({
    type: ADD_APPLICATION,
    payload:application
});


