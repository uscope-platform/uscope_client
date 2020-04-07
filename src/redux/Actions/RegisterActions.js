import { LOAD_REGISTERS, SEND_REGISTER} from "./types";
import axios from "axios";

export const sendRegister = (server_url ,register, config) => {
    return dispatch => {
        axios.post(server_url,{payload:register}, config).then(() => {
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


