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

export const api_dictionary = {
    operations: {
        load_application:"operations/load_application",
        write_registers:"operations/write_registers",
        read_register:"operations/read_register",
        compile_program:"operations/compile_program",
        apply_program:"operations/apply_program",
        clock: "operations/clock",

        fetch_data:'operations/plot/data',
        set_channel_status: 'operations/plot/channel_status',
        scaling_factors: 'operations/plot/channel_scaling',
        acquisition: 'operations/plot/acquisition',
        scope_address:'operations/plot/address',
        dma_disable:'operations/plot/dma_disable',
        hil_debug: 'operations/hil/debug',
        hil_deploy: 'operations/hil/deploy',
        hil_emulate: 'operations/hil/emulate',
        hil_disassemble: 'operations/hil/disassemble',
        hil_hardware_sim: 'operations/hil/hardware_sim',
        hil_select_output: 'operations/hil/select_out',
        hil_set_input: 'operations/hil/set_input',
        hil_start:'operations/hil/start',
        hil_stop:'operations/hil/stop',
        filter_design:"operations/filter_design",
        filter_implement:"operations/filter_implement",
        filter_response:"operations/filter_response",
        filter_apply:"operations/filter_apply",
    },
    applications:{
        get_hash: 'application/hash',
        load_all: 'application/load_all',
        add: 'application',
        edit: 'application',
        remove: 'application'
    },
    bitstream:{
        get_hash: 'bitstream/hash',
        load_all: 'bitstream/load_all',
        get: 'bitstream',
        add: 'bitstream',
        edit: 'bitstream',
        delete: 'bitstream'
    },
    peripherals:{
        get_hash: 'peripheral/hash',
        load_all: 'peripheral/load_all',
        add: 'peripheral',
        edit: 'peripheral',
        delete: 'peripheral'
    },
    platform:{
        users:{
            add:'platform/user',
            delete: 'platform/user',
            need_onboarding: 'platform/onboarding',
            do_onboarding: 'platform/onboarding',
            get_list: 'platform/user',
            manual_login: 'platform/login/manual',
            auto_login: 'platform/login/auto'
        },
        db:{
            dump:'database/export',
            restore:'database/import',
            versions:'platform/versions'
        }
    },
    programs:{
        get_hash:'program/hash',
        load_all: 'program/load_all',
        add: 'program',
        edit: 'program',
        delete: 'program'
    },
    scripts:{
        get_hash:'script/hash',
        load_all: 'script/load_all',
        add: 'script',
        edit: 'script',
        delete: 'script',
    },
    filters:{
        get_hash: 'filter/hash',
        load_all: 'filter/load_all',
        load: 'filter',
        add: 'filter',
        edit: 'filter',
        delete: 'filter'
    },
    emulators:{
        get_hash:'emulator/hash',
        load_all: 'emulator/load_all',
        add: 'emulator',
        edit: 'emulator',
        delete: 'emulator'
    },
    settings:{
        debug_level:'settings/debug_level',
        hil_address_map:'settings/hil_address_map',
        debugger_option:'settings/debugger_option',
    }
}