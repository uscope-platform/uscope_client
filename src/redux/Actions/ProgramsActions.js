import {ADD_PROGRAM, EDIT_PROGRAM, LOAD_ALL_PROGRAMS, REMOVE_PROGRAM} from "./types";
import axios from "axios";

export const addProgram = (server_url, program, config) =>{
    return dispatch => {
        axios.post(server_url, program, config).then(res => {
            dispatch(AddProgramDone(program));
        }).catch(err => {
            alert(err.message);
        });
    };
};

const AddProgramDone = program =>({
    type: ADD_PROGRAM,
    payload:program
});


export const editProgram = (server_url, program, config) =>{
    return dispatch => {
        axios.patch(server_url,program, config).then(res => {
            dispatch(editProgramDone(program));
        }).catch(err => {
            alert(err.message);
            dispatch(editProgramDone(program));
        });
    };
};

const editProgramDone = program =>({
    type: EDIT_PROGRAM,
    payload:program
});

export const removeProgram = (server_url, program, config) =>{
    return dispatch => {
        axios.delete(server_url, config).then(res => {
            dispatch(removeProgramDone(program));
        }).catch(err => {
            alert(err.message);
        });
    };
};

const removeProgramDone = program =>({
    type: REMOVE_PROGRAM,
    payload:program
});


export const loadAllPrograms = (server_url, config) =>{
    return dispatch => {
        axios.get(server_url, config).then(res => {
            dispatch(loadAllProgramsDone(res.data));
        }).catch(err => {
            alert(err.message);
        });
    };
};

const loadAllProgramsDone = programs =>({
    type: LOAD_ALL_PROGRAMS,
    payload:programs
});
