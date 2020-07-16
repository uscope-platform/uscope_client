import axios from "axios"
import {sendRegister} from "../redux/Actions/RegisterActions";
import {loadPeripherals} from "../redux/Actions/peripheralsActions";
import store from "../store";

export default function peripheralProxy(server_url, token) {
    let _this = this;
    this.server_url = server_url;
    this.config = {headers: { Authorization: `Bearer ${token}` }};

    this.getPeripheralRegisters = function (peripheral_name) {
        return new Promise(function (resolve, reject) {
            axios.get(_this.server_url+'registers/'+peripheral_name+'/descriptions', _this.config)
                .then(res => {
                    resolve(res.data);
                })
        });
    };

    this.bulkRegisterWrite = (registers) =>{
        return new Promise(function (resolve, reject) {
            axios.post(_this.server_url+'registers/bulk_write', registers,_this.config)
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
    this.setRegisterValue = (register) => {
        store.dispatch(sendRegister(_this.server_url+'registers/'+register.peripheral+'/value', register, _this.config))
    };

    this.loadAllPeripherals = () =>{
        store.dispatch(loadPeripherals(_this.server_url+'registers/all_peripheral/descriptions', _this.config))
    };

    this.get_peripherals_hash = () =>{
        return new Promise(function (resolve, reject) {
            axios.get(_this.server_url+'registers/digest', _this.config)
                .then(res => {
                    resolve(res.data);
                })
        });
    }
}




