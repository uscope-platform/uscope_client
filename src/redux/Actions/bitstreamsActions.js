import {ADD_BITSTREAM, EDIT_BITSTREAM, LOAD_ALL_BITSTREAMS, REMOVE_BITSTREAM} from "./types";
import axios from "axios";
import {setSetting} from "./SettingsActions";

export const addBitstream = (server_url, script, config) =>{
    return dispatch => {
        axios.post(server_url, script, config).then(res => {
            dispatch(AddBitstreamDone(script));
        }).catch(err => {
            alert(err.message);
        });
    };
};

const AddBitstreamDone = bitstream =>({
    type: ADD_BITSTREAM,
    payload:bitstream
});


export const editBitstream = (server_url, script, config) =>{
    return dispatch => {
        axios.patch(server_url,script, config).then(res => {
            dispatch(editBitstreamDone(script));
        }).catch(err => {
            alert(err.message);
            dispatch(editBitstreamDone(script));
        });
    };
};

const editBitstreamDone = bitstream =>({
    type: EDIT_BITSTREAM,
    payload:bitstream
});

export const removeBitstream = (server_url, script, config) =>{
    return dispatch => {
        axios.delete(server_url, config).then(res => {
            dispatch(removeBitstreamDone(script));
        }).catch(err => {
            alert(err.message);
        });
    };
};

const removeBitstreamDone = bitstream =>({
    type: REMOVE_BITSTREAM,
    payload:bitstream
});


export const loadAllBitstreams = (server_url, config) =>{
    return dispatch => {
        axios.get(server_url, config).then(res => {
            dispatch(loadAllBitstreamsDone(res.data));
            dispatch(setSetting(["loaded_bitstreams", true]));
        }).catch(err => {
            alert(err.message);
        });
    };
};

const loadAllBitstreamsDone = bitstreams =>({
    type: LOAD_ALL_BITSTREAMS,
    payload:bitstreams
});
