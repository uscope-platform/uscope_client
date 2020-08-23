import axios from "axios"
import store from "../store";
import {addProgram, editProgram, loadAllPrograms, removeProgram} from "../redux/Actions/ProgramsActions";

export default function programsProxy(server_url, token) {
    let _this = this;
    this.server_url = server_url;
    this.config = {headers: { Authorization: `Bearer ${token}` }};

    this.upload_program = function (program) {
        store.dispatch(addProgram(_this.server_url+'program/'+program.id, program, _this.config));
    };

    this.edit_program = function (program) {
        store.dispatch(editProgram(_this.server_url+'program/'+program.id, program, _this.config));
    };

    this.load_all = () =>{
        store.dispatch(loadAllPrograms(_this.server_url+'program/none', _this.config));
    };

    this.get_hash = () =>{
        return new Promise(function (resolve, reject) {
            axios.get(_this.server_url+'program/hash', _this.config)
                .then(res => {
                    resolve(res.data);
                })
        });
    };

    this.delete_program = (program) => {
        store.dispatch(removeProgram(_this.server_url+'program/'+program.id, program, _this.config));
    };

    this.compile_program = (program) =>{
        return new Promise(function (resolve, reject) {
            axios.get(_this.server_url+'program/compile/'+program.id, _this.config)
                .then(res =>{
                    resolve(res.data);
                })
        })
    };

}




