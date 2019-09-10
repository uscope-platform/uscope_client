import { LOAD_REGISTERS, SET_SINGLE_VALUE_REGISTER, SET_TWO_VALUE_REGISTER, SEND_REGISTER} from "./types";
import axios from "axios";

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

export const sendRegister = (server_url ,register) => {
    return dispatch => {
        axios.post(server_url,{payload:register}).then(() => {
            dispatch(sendRegisterDone(register));
        }).catch(err => {
            alert(err.message);
        });
    };
};

const sendRegisterDone = (register) => ({
    type: SEND_REGISTER,
    payload:{
        name: register.name,
        peripheral: register.peripheral,
        value: register.value
    }
});


export const loadRegisters = (peripheral, value) =>{
    return{
        type: LOAD_REGISTERS,
        payload:{
            peripheral:peripheral,
            value:value
        }
    }
};


