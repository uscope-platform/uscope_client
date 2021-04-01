import { ADD_PERIPHERAL, EDIT_PERIPHERAL, LOAD_PERIPHERALS, REMOVE_PERIPHERAL} from "./types";
import axios from 'axios';
import {setSetting} from "./SettingsActions";


export const loadPeripherals = (server_url, config) => {
    return dispatch => {
        axios.get(server_url, config).then(res => {
            dispatch(loadPeripheralsDone(res.data));
            dispatch(setSetting(["loaded_peripherals", true]));
        }).catch(err => {
            alert(err.message);
        });
    };
};

const loadPeripheralsDone = parameters => ({
    type: LOAD_PERIPHERALS,
    payload: parameters
});

export const editPeripheral = (server_url, edit, config) => {
    return dispatch => {
        axios.post(server_url, edit, config).then(res => {
            dispatch(editPeripheralDone(edit));
        }).catch(err => {
            alert(err.message);
        });
    };
};

const editPeripheralDone = edit => ({
    type: EDIT_PERIPHERAL,
    payload: edit
});


export const removePeripheral = (server_url, peripheral, config) =>{
    return dispatch => {
        axios.get(server_url, config).then(res => {
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


export const addPeripheral = (server_url, peripheral_obj, config) =>{
    return dispatch => {
        axios.post(server_url, peripheral_obj, config).then(res => {
            dispatch(addPeripheralDone(peripheral_obj));
        }).catch(err => {
            alert(err.message);
        });
    };
};

const addPeripheralDone = peripheral_obj =>({
    type: ADD_PERIPHERAL,
    payload:peripheral_obj
});