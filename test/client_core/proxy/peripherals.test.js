import {bulk_register_write, get_peripheral_registers, set_register_value} from "../../../src/client_core";
import {bulk_write_data_check, set_register_data} from "../mock/peripherals_api";



test("get_periph_registers", () => {

    return get_peripheral_registers("test_periph").then((res) =>{
        let check = {
            peripheral_name: "test_periph",
            registers: {
                "reg_1": [7594],
                "reg_2": [8810]
            }
        }
        expect(res).toStrictEqual(check);
    })
})

test("bulk_register_write", () =>{
    let data = {
        payload: [
            {
                address: 1136656420,
                value: 7
            },
            {
                address: 1136657148,
                value: 6
            }
        ]
    }

    return bulk_register_write(data).then((res)=>{
        expect(bulk_write_data_check).toStrictEqual(data);
    })
})


test("set register value", () =>{
    let data = {
        name: "Control register",
        peripheral: "PID",
        value: 2108
    }

    return set_register_value(data).then((res)=>{
        let check_data = {
            "name": "PID",
            "body": {
                "payload": {
                    "name": "Control register",
                    "peripheral": "PID",
                    "value": 2108
                }
            }
        }
        expect(set_register_data).toStrictEqual(check_data);
    })
})
