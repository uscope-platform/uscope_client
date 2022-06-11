import {applyMiddleware, combineReducers, createStore} from "redux";
import BitstreamsReducer from "../../../src/redux/Reducers/bitstreamsReducer";
import settingsReducer from "../../../src/redux/Reducers/settingsReducer";
import plotReducer from "../../../src/redux/Reducers/plotReducer";
import registerValuesReducer from "../../../src/redux/Reducers/registerReducer";
import PeripheralsReducer from "../../../src/redux/Reducers/PeripheralsReducer";
import ApplicationsReducer from "../../../src/redux/Reducers/applicationsReducer";
import programsReducer from "../../../src/redux/Reducers/ProgramsReducer";
import {scriptsReducer, scriptsWorkspaceReducer} from "../../../src/redux/Reducers/scriptsReducer";
import thunk from "redux-thunk";
import {up_application, up_peripheral, up_script, up_program, up_bitstream} from "../../../src/client_core";

export let register_writes = [];


let settings_init = {
    application:'SicDrive'
}

let test_application = {
        application_name: 'SicDrive',
        bitstream: 'scm.bin',
        channel_groups: [],
        channels: [],
        clock_frequency: 100000000,
        default_core_address: '0x83c00000',
        initial_registers_values: [
            {
                address: '0x43c001b0',
                value: '6144'
            }
        ],
        macro: [
            {
                name: 'configure_master',
                trigger: 'sicD_configure_trg'
            },
            {
                name: 'configure_cells',
                trigger: 'sicD_setup_cells_trg'
            },
            {
                name: 'start_modulators',
                trigger: 'sicD_start_mod_trg'
            },
            {
                name: 'Step_reference',
                trigger: 'step_ref_trg'
            },
            {
                name: 'stop_drive',
                trigger: 'stop_drive_trg'
            },
            {
                name: 'inject_fault',
                trigger: 'inject_fault_trg'
            },
            {
                name: 'acknowledge capture',
                trigger: 'capture_ack_trg'
            },
            {
                name: 'load_step',
                trigger: 'lstep_trg'
            },
            {
                name: 'setup load step',
                trigger: 'setup_load_step_trg'
            }
        ],
        n_enables: '1',
        parameters: [
            {
                parameter_id: 'deadtime',
                parameter_name: 'Deadtime',
                trigger: 'fp_dead_trg',
                value: '0.7e-6',
                visible: true
            },
            {
                parameter_id: 'deadtime_correction',
                parameter_name: 'Deadtime correction',
                trigger: 'fp_dta_trg',
                value: '0.225',
                visible: true
            },
            {
                parameter_id: 'current_sense_frequency',
                parameter_name: 'current_sense_frequency',
                trigger: 'i_sense_freq_trg',
                value: '240e3',
                visible: false
            },
            {
                parameter_id: 'i_out',
                parameter_name: 'Output Current',
                trigger: 'sicD_i_out_trg',
                value: '100',
                visible: true
            },
            {
                parameter_id: 'speed_iq_setpoint',
                parameter_name: 'speed iq setpoint',
                trigger: 'f_setpoint_trg',
                value: '400',
                visible: true
            }
        ],
        peripherals: [
            {
                base_address: '0x43c00254',
                name: 'adc_processing_ch1',
                peripheral_id: 'adc_proc_1',
                proxied: false,
                proxy_address: '0',
                spec_id: 'ADC_processing',
                type: 'Registers'
            },
            {
                base_address: '0x43c00254',
                name: 'adc_processing_ch2',
                peripheral_id: 'adc_proc_2',
                proxied: true,
                proxy_type:'rtcu',
                proxy_address: '0x42',
                spec_id: 'ADC_processing',
                type: 'Registers'
            },
            {
                base_address: '0x43c00254',
                name: 'adc_processing_ch3',
                peripheral_id: 'adc_proc_3',
                proxied: true,
                proxy_type:'axis_const',
                proxy_address: '0x65',
                spec_id: 'ADC_processing',
                type: 'Registers'
            }
        ],
        scope_mux_address: '0x43c00300',
        timebase_address: '0x43c00304'
}


let applications_init = {
    SicDrive: new up_application(test_application)
}

let test_peripheral =  {
    image: 'static/Images/ADC_processing.png',
    peripheral_name: 'ADC_processing',
    registers: [
        {
            ID: 'cmp_thr_1',
            description: 'This register controls the thresholds for the low (latching mode) and low-falling (normal mode) thresholds, for the filtered (lower word) and fast acting (higher word) comparators',
            direction: 'R/W',
            field_descriptions: [
                'Threshold for the filtered comparator',
                'Threshold for the fast acting comparator'
            ],
            field_names: [
                'Filtered threshold',
                'Fast threshold'
            ],
            offset: '0x0',
            register_format: 'words',
            register_name: 'Comparators threshold 1',
            value: 0
        }
    ],
    version: '0.1'
}

let peripherals_init = {
    ADC_processing: new up_peripheral(test_peripheral)
}



let test_script = `
function start_trigger_cl(parameters, context) {

    let registers = {};
    
    let deadtime = context.workspace.deadtime;
    let dta_correction = context.workspace.fp_dta;

    let pwm_clock = 100e6;
    let period = Math.round(pwm_clock/context.workspace.i_sense_freq)*2;
    let deadtime_count = Math.round(pwm_clock*2*deadtime);
    
    let dta_correction_int = Math.round(2**16*dta_correction);
    
    
    let duty_lim_low = 0.1;
    let duty_lim_high = 0.9;
    
    registers['adc_proc_1.cmp_thr_1'] = 6;
    registers['adc_proc_2.cmp_thr_1'] = 4;
    registers['adc_proc_3.cmp_thr_1'] = 1;
    
    return {workspace:null, registers:registers};
 
}
`

let scripts_init = {
    '1': new up_script({
        id: 1,
        name: 'test_trigger',
        path: null,
        script_content: test_script,
        triggers: 'test_trigger'
    }),
    '2': new up_script({
        id: 2,
        name: 'fp_dta',
        path: null,
        script_content: test_script,
        triggers: 'fp_dta_trg'
    }),
    '3': new up_script({
        id: 3,
        name: 'test_script',
        path: null,
        script_content: "",
        triggers: 'test_trigger'
    })

}

let bitstream_init = {1:new up_bitstream({
        "id": 1,
        "name": "test.bin"
    })
}

let programs_init = {
    1:new up_program({
        "id": 1,
        "name": "new_program_1",
        "program_content": "iocbnojrenjcor",
        "program_type": "asm"
    })
}


let plot_init = {
    data: {},
    loading_done:false,
    plot_running:false,
    datarevision:0,
    parameters:{
        memory_depth: 1024
    }
}

const rootReducer = (state, action) => {
    if (action.type === 'RESET_STORE') {
        return mock_reducer(initial_redux_state, action)
    }
    return mock_reducer(state, action)
}

export const mock_reducer = combineReducers({
    bitstreams:BitstreamsReducer,
    settings : settingsReducer,
    plot: plotReducer,
    registerValues: registerValuesReducer,
    peripherals:PeripheralsReducer,
    applications : ApplicationsReducer,
    programs : programsReducer,
    scripts: scriptsReducer,
    scriptsWorkspace: scriptsWorkspaceReducer
});

export const initial_redux_state = {
    peripherals: peripherals_init,
    applications: applications_init,
    settings: settings_init,
    scripts: scripts_init,
    bitstreams: bitstream_init,
    programs : programs_init,
    plot: plot_init,
    registerValues: {},
    scriptsWorkspace: {}
};

export const mock_store = createStore(
    rootReducer,
    initial_redux_state,
    applyMiddleware(...[thunk])
);
