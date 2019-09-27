import {LOAD_PERIPHERALS, REMOVE_PERIPHERAL} from "./types";
import axios from 'axios';


export const loadPeripherals = (server_url) => {
    return dispatch => {
        axios.get(server_url).then(res => {
            dispatch(loadPeripheralsDone(res.data));
        }).catch(err => {
            alert(err.message);
        });
    };
};

const loadPeripheralsDone = parameters => ({
    type: LOAD_PERIPHERALS,
    payload: parameters
});


export const removePeripheral = (server_url, peripheral) =>{
    return dispatch => {
        axios.get(server_url).then(res => {
            dispatch(removePeripheralDone(peripheral));
        }).catch(err => {
            alert(err.message);
        });
    };
};

const removePeripheralDone = peripheral =>({
  type: REMOVE_PERIPHERAL,
  payload:peripheral
});
