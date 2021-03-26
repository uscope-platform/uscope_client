import axios from "axios"
import store from "../store";
import {addProgram, editProgram, loadAllPrograms, removeProgram} from "../redux/Actions/ProgramsActions";

let programsProxy = class{
    constructor(server_url, token) {
        this.server_url = server_url;
        this.config = {headers: { Authorization: `Bearer ${token}` }};
    }

    upload_program =  (program) => {
        store.dispatch(addProgram(this.server_url+'program/'+program.id, program, this.config));
    };

    edit_program =  (program) => {
        store.dispatch(editProgram(this.server_url+'program/'+program.id, program, this.config));
    };

    load_all = () =>{
        store.dispatch(loadAllPrograms(this.server_url+'program/none', this.config));
    };

    get_hash = () =>{
        return new Promise( (resolve, reject) => {
            axios.get(this.server_url+'program/hash', this.config)
                .then(res => {
                    resolve(res.data);
                })
        });
    };

    delete_program = (program) => {
        store.dispatch(removeProgram(this.server_url+'program/'+program.id, program, this.config));
    };

    compile_program = (program) =>{
        return new Promise( (resolve, reject) => {
            axios.get(this.server_url+'program/compile/'+program.id, this.config)
                .then(res =>{
                    resolve(res.data);
                })
        })
    };

    apply_program = (program) => {
        return new Promise( (resolve, reject) => {
            axios.post(this.server_url+'program/Apply/'+program.id, program, this.config).then(res => {
                resolve(res.data);
            }).catch(err => {
                alert(err.message);
            });
        })
    }
}

export default programsProxy;
