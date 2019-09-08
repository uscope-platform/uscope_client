import {SET_SINGLE_VALUE_REGISTER, SET_TWO_VALUE_REGISTER} from "./types";

export const setSingleValueRegister = (register_name, register_value, peripheral) =>{
    return {
        type: SET_SINGLE_VALUE_REGISTER,
        payload:{
            name: register_name,
            peripheral: peripheral,
            value: register_value
        }
    }
};


export const setTwoValueRegister = (register_name, register_value, peripheral) =>{
    return {
        type: SET_TWO_VALUE_REGISTER,
        payload:{
            name: register_name,
            peripheral: peripheral,
            value: register_value
        }
    }
};
