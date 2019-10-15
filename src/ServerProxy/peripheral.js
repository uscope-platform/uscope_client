import axios from "axios"
import {sendRegister} from "../redux/Actions/RegisterActions";
import {loadPeripherals} from "../redux/Actions/peripheralsActions";
import store from "../store";

export default function peripheralProxy(server_url) {
    let _this = this;
    this.server_url = server_url;


    this.getPeripheralRegisters = function (peripheral_name) {
        return new Promise(function (resolve, reject) {
            axios.get(_this.server_url+'registers/'+peripheral_name+'/descriptions')
                .then(res => {
                    resolve(res.data);
                })
        });
    };

    this.bulkRegisterWrite = (registers) =>{
        return new Promise(function (resolve, reject) {
            axios.post(_this.server_url+'registers/bulk_write', registers)
                .then(res => {
                    resolve(res.data);
                })
        });
    };

    this.setRegisterValue = (register) => {
        store.dispatch(sendRegister(_this.server_url+'registers/'+register.peripheral+'/value', register))
    };

    this.loadAllPeripherals = () =>{
        store.dispatch(loadPeripherals(_this.server_url+'registers/all_peripheral/descriptions'))
    };

    this.get_peripherals_hash = () =>{
        return new Promise(function (resolve, reject) {
            axios.get(_this.server_url+'registers/digest')
                .then(res => {
                    resolve(res.data);
                })
        });
    }
}




