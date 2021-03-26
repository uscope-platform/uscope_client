import axios from "axios"
import {sendRegister} from "../redux/Actions/RegisterActions";
import {loadPeripherals} from "../redux/Actions/peripheralsActions";
import store from "../store";


let PeripheralProxy = class{

    getPeripheralRegisters =  (peripheral_name) => {
        return new Promise( (resolve, reject) => {
            let state = store.getState();
            axios.get(state.settings.server_url+'registers/'+peripheral_name+'/descriptions', state.settings.auth_config)
                .then(res => {
                    resolve(res.data);
                })
        });
    };

    bulkRegisterWrite = (registers) =>{
        return new Promise( (resolve, reject) => {
            let state = store.getState();
            axios.post(state.settings.server_url+'registers/bulk_write', registers, state.settings.auth_config)
                .then(res => {
                    resolve(res.data);
                })
        });
    };

    /**
     * This method sets the value of a register
     * @param {Object} register - An object containing the details of the register to set;
     * @param {String} register.name - Name of the register to set.
     * @param {String} register.peripheral - Name of the peripheral whose register has to be set.
     * @param {Number} register.value - Value to set the register to.
     */
    setRegisterValue = (register) => {
        let state = store.getState();
        store.dispatch(sendRegister(state.settings.server_url+'registers/'+register.peripheral+'/value', register, state.settings.auth_config))
    };

    load_all = () =>{
        let state = store.getState();
        store.dispatch(loadPeripherals(state.settings.server_url+'registers/all_peripheral/descriptions', state.settings.auth_config))
    };

    get_hash = () =>{
        return new Promise( (resolve, reject) => {
            let state = store.getState();
            axios.get(state.settings.server_url+'registers/digest', state.settings.auth_config)
                .then(res => {
                    resolve(res.data);
                })
        });
    }

};

export default PeripheralProxy;

