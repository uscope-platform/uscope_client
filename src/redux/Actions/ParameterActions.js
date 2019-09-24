import {LOAD_PARAMETERS_DONE, SEND_PARAMETER} from "./types";
import axios from 'axios';




export const sendParameter = (parameter) => ({
    type: SEND_PARAMETER,
    payload:{
        name: parameter.name,
        value: parameter.value
    }
});


export const loadParameters = (server_url) => {
    return dispatch => {
        axios.get(server_url).then(res => {
                dispatch(loadParametersDone(res.data));
            }).catch(err => {
                alert(err.message);
            });
    };
};

const loadParametersDone = parameters => ({
    type: LOAD_PARAMETERS_DONE,
    payload: parameters
});
