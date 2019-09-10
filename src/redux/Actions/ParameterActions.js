import {LOAD_PARAMETERS_DONE, SEND_PARAMETER} from "./types";
import axios from 'axios';




export const sendParameter = (server_url , parameter) => {
     return dispatch => {
         axios.post(server_url,{payload:parameter}).then(() => {
             dispatch(sendParameterDone(parameter));
         }).catch(err => {
             alert(err.message);
         });
    };
};

const sendParameterDone = (parameter) => ({
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