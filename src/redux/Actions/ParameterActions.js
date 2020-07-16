import {LOAD_PARAMETERS_DONE, SAVE_PARAMETER} from "./types";
import axios from 'axios';


export const saveParameter = (parameter) => ({
    type: SAVE_PARAMETER,
    payload:{
        name: parameter.name,
        value: parameter.value
    }
});


export const loadParameters = (server_url, config) => {
    return dispatch => {
        axios.get(server_url, config).then(res => {
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
