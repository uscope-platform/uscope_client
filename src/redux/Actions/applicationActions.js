import {LOAD_APPLICATIONS, REMOVE_APPLICATION} from "./types";
import axios from 'axios';


export const loadApplications = (server_url) => {
    return dispatch => {
        axios.get(server_url).then(res => {
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


export const removeApplication = (server_url, application) =>{
    return dispatch => {
        axios.get(server_url).then(res => {
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
