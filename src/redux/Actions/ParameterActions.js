import {SET_PARAMETER_VALUE} from "./types";

export const setParameterValue = (parameter_name, parameter_value) =>{
    return {
        type: SET_PARAMETER_VALUE,
        payload:{
            name: parameter_name,
            value: parameter_value
        }
    }
};


export const loadParameters = (server_url)  => {



};

