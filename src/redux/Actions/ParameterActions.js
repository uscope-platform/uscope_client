import {SET_PARAMETER_VALUE, LOAD_PARAMETERS_DONE} from "./types";
import axios from 'axios';


export const setParameterValue = (parameter_name, parameter_value) =>{
    return {
        type: SET_PARAMETER_VALUE,
        payload:{
            name: parameter_name,
            value: parameter_value
        }
    }
};


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