import axios from "axios"
import store from "../store";
import {addProgram, editProgram, loadAllPrograms, removeProgram} from "../redux/Actions/ProgramsActions";

let ProgramsProxy = class{

    upload_program =  (program) => {
        let state = store.getState();
        store.dispatch(addProgram(state.settings.server_url+'program/'+program.id, program, state.settings.auth_config));
    };

    edit_program =  (program) => {
        let state = store.getState();
        store.dispatch(editProgram(state.settings.server_url+'program/'+program.id, program, state.settings.auth_config));
    };

    load_all = () =>{
        let state = store.getState();
        store.dispatch(loadAllPrograms(state.settings.server_url+'program/none', state.settings.auth_config));
    };

    get_hash = () =>{
        return new Promise( (resolve, reject) => {
            let state = store.getState();
            axios.get(state.settings.server_url+'program/hash', state.settings.auth_config)
                .then(res => {
                    resolve(res.data);
                })
        });
    };

    delete_program = (program) => {
        let state = store.getState();
        store.dispatch(removeProgram(state.settings.server_url+'program/'+program.id, program, state.settings.auth_config));
    };

    compile_program = (program) =>{
        return new Promise( (resolve, reject) => {
            let state = store.getState();
            axios.get(state.settings.server_url+'program/compile/'+program.id, state.settings.auth_config)
                .then(res =>{
                    resolve(res.data);
                })
        })
    };

    apply_program = (program) => {
        return new Promise( (resolve, reject) => {
            let state = store.getState();
            axios.post(state.settings.server_url+'program/Apply/'+program.id, program, state.settings.auth_config).then(res => {
                resolve(res.data);
            }).catch(err => {
                alert(err.message);
            });
        })
    }
}

export default ProgramsProxy;
