import {ADD_APPLICATION, EDIT_APPLICATION, LOAD_APPLICATIONS, REMOVE_APPLICATION, SAVE_PARAMETER} from "./types";
import axios from 'axios';


export const saveParameter = (parameter) => ({
    type: SAVE_PARAMETER,
    payload:{
        name: parameter.name,
        value: parameter.value,
        app:parameter.app
    }
});

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


export const editApplication = (server_url,edit, config) => {

    return dispatch => {
        axios.post(server_url, edit, config).then(res => {
            dispatch(editApplicationDone(edit));
        }).catch(err => {
            alert(err.message);
        });
    };
};

const editApplicationDone = edit => ({
    type: EDIT_APPLICATION,
    payload: edit
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


