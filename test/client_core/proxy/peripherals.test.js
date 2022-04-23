import {
    bulk_register_write,
    create_peripheral,
    get_peripheral_registers,
    set_register_value
} from "../../../src/client_core";
import {
    bulk_write_data_check,
    created_peripheral, edit_peripheral_data,
    peripheral_image, remove_peripheral_data,
    set_register_data
} from "../mock/peripherals_api";
import {edit_peripheral, remove_peripheral} from "../../../src/client_core/proxy/peripherals";
import {mock_store} from "../mock/redux_store";


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



test("create peripheral with image", () =>{
    let periph = {
        test: {
            peripheral_name: "test",
            version: 0.1,
            registers: []
        }
    }
    let image = new File(["TEST FILE IMAGE DUMMY"], "filename");
    return create_peripheral(periph, image).then((res)=>{
        // THE IMAGE CAN NOT BE TESTED EASILY, SO IT IS NOT
        expect(created_peripheral).toStrictEqual({
            image:true,
            payload:{
                test: {
                    peripheral_name: "test",
                    version: 0.1,
                    registers: []
                }
            }
        });
    })
})


test("create peripheral without image", () =>{
    let periph = {
        test: {
            peripheral_name: "test",
            version: 0.1,
            registers: []
        }
    }
    return create_peripheral(periph, null).then((res)=>{

        expect(created_peripheral).toStrictEqual({
            image:false,
            payload:{
                test: {
                    peripheral_name: "test",
                    version: 0.1,
                    registers: []
                }
            }
        });
    })
})

test("edit peripheral", () =>{

    let edit = {
        application:"test",
        peripheral:"ADC_processing",
        field:"version",
        value:3,
        action:"edit_peripheral"
    };
    let initial_val = mock_store.getState().peripherals["ADC_processing"];
    return edit_peripheral(edit).then((res)=>{
        initial_val.version = 3;
        let new_val = mock_store.getState().peripherals["ADC_processing"];
        expect(new_val).toStrictEqual(initial_val);
        expect(edit_peripheral_data).toStrictEqual(edit);
    })
})



test("remove peripheral", () =>{
    return remove_peripheral("ADC_processing").then((res)=>{
        expect(remove_peripheral_data).toBe("ADC_processing");
        let peripherals = mock_store.getState().peripherals;
        expect(peripherals).not.toHaveProperty("ADC_processing");
    })
})
