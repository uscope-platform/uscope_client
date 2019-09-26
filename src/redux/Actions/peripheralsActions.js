import {LOAD_PERIPHERALS} from "./types";
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
