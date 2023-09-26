// Copyright 2021 Filippo Savi
// Author: Filippo Savi <filssavi@gmail.com>
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { rest } from 'msw'


export const applications_init = {
    SicDrive: {
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
            }
        ],
        scope_mux_address: '0x43c00300',
        timebase_address: '0x43c00304'
    }
}


export const peripherals_init = {
    ADC_processing: {
        peripheral_name: 'ADC_processing',
        registers: [
            {
                ID: 'cmp_thr_1',
                description: 'This register controls the thresholds for the low (latching mode) and low-falling (normal mode) thresholds, for the filtered (lower word) and fast acting (higher word) comparators',
                direction: 'R/W',
                offset: '0x0',
                fields: [],
                register_name: 'Comparators threshold 1',
                value: 0
            }
        ],
        version: '0.1'
    }
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
    
    return {workspace:null, registers:registers};
 
}
`

export const scripts_init = {
    '1': {
        id: 1,
        name: 'test_trigger',
        path: null,
        script_content: test_script,
        triggers: 'test_trigger'
    },
    '2': {
        id: 2,
        name: 'fp_dta',
        path: null,
        script_content: test_script,
        triggers: 'fp_dta_trg'
    },
    '3': {
        id: 3,
        name: 'test_script',
        path: null,
        script_content: "",
        triggers: 'test_trigger'
    }

}

export const bitstream_init = {
    1:{
        "id": 1,
        "name": "test.bin"
    }
}

export const programs_init = {
    1:{
        "id": 1,
        "name": "new_program_1",
        "program_content": "iocbnojrenjcor",
        "program_type": "asm"
    }
}

export const filters_init = {
    1: {
        "id": 1,
        "name": "new filter_1",
        "parameters": {
            "n_taps": 100,
            "pass_band_edge_1": 0,
            "pass_band_edge_2": 0,
            "sampling_frequency": 0,
            "stop_band_edge_1": 0,
            "stop_band_edge_2": 0,
            "taps_width": 16,
            "type": "lp"
    }
}
}




export const cache_handlers = [

    rest.get('test_server/application/digest', (req, res, ctx) => {
        return res(
            ctx.text("9bcb1e2d-dc4c-44cb-be5d-3897f288c617"),
            ctx.status(200)
        )
    }),

    rest.get('test_server/application/all/specs', (req, res, ctx) => {
        return res(
            ctx.json(applications_init),
            ctx.status(200)
        )
    }),


    rest.get('test_server/registers/digest', (req, res, ctx) => {

        return res(
            ctx.text("94c46594-3bb9-4fae-b6aa-a61e03a288e2"),
            ctx.status(200)
        )
    }),

    rest.get('test_server/registers/all_peripheral/descriptions', (req, res, ctx) => {

        return res(
            ctx.json(peripherals_init),
            ctx.status(200)
        )
    }),

    rest.get('test_server/script/hash', (req, res, ctx) => {


        return res(
            ctx.text("9701008d-c511-4ded-94b3-b08748a6e066"),
            ctx.status(200)
        )
    }),

    rest.get('test_server/script/none', (req, res, ctx) => {

        return res(
            ctx.json(scripts_init),
            ctx.status(200)
        )
    }),


    rest.get('test_server/program/hash', (req, res, ctx) => {

        return res(
            ctx.text("d0f84519-10da-4ada-8727-8bd6a0f608e0"),
            ctx.status(200)
        )
    }),

    rest.get('test_server/program/none', (req, res, ctx) => {

        return res(
            ctx.json(programs_init),
            ctx.status(200)
        )
    }),

    rest.get('test_server/bitstream/digest', (req, res, ctx) => {

        return res(
            ctx.text("74478cc1-fdb7-486a-975c-129c71400530"),
            ctx.status(200)
        )
    }),

    rest.get('test_server/filters/digest', (req, res, ctx) => {

        return res(
            ctx.text("56dd465c-2aa3-46dc-ab05-db35e217f801"),
            ctx.status(200)
        )
    }),

    rest.get('test_server/bitstream/none', (req, res, ctx) => {

        return res(
            ctx.json(bitstream_init),
            ctx.status(200)

        )
    }),

    rest.get('test_server/filters/none', (req, res, ctx) => {

        return res(
            ctx.json(filters_init),
            ctx.status(200)

        )
    }),
]