import axios from "axios"
import {sendRegister} from "../redux/Actions/RegisterActions";
import {loadPeripherals} from "../redux/Actions/peripheralsActions";
import store from "../store";


let peripheralProxy = class{
    constructor(server_url, token) {
        this.server_url = server_url;
        this.config = {headers: { Authorization: `Bearer ${token}` }};
    }

    getPeripheralRegisters =  (peripheral_name) => {
        return new Promise( (resolve, reject) => {
            axios.get(this.server_url+'registers/'+peripheral_name+'/descriptions', this.config)
                .then(res => {
                    resolve(res.data);
                })
        });
    };

    bulkRegisterWrite = (registers) =>{
        return new Promise( (resolve, reject) => {
            axios.post(this.server_url+'registers/bulk_write', registers, this.config)
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
        store.dispatch(sendRegister(this.server_url+'registers/'+register.peripheral+'/value', register, this.config))
    };

    load_all = () =>{
        store.dispatch(loadPeripherals(this.server_url+'registers/all_peripheral/descriptions', this.config))
    };

    get_hash = () =>{
        return new Promise( (resolve, reject) => {
            axios.get(this.server_url+'registers/digest', this.config)
                .then(res => {
                    resolve(res.data);
                })
        });
    }

};

export default peripheralProxy;

