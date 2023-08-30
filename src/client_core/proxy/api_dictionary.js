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
    applications:{
        get_hash: 'application/digest',
        load_all: 'application/all/specs',
        add: 'application/add',
        edit: 'application/edit',
        remove: 'application/remove',
        set:'application/set'
    },
    bitstream:{
        get_hash: 'bitstream/digest',
        load_all: 'bitstream/none',
        add: 'bitstream',
        edit: 'bitstream',
        delete: 'bitstream'
    },
    peripherals:{
        get_hash: 'registers/digest',
        load_all: 'registers/all_peripheral/descriptions',
        bulk_write: 'registers/bulk_write',
        direct_read: 'registers/direct_read',
        add: 'tab_creator/create_peripheral',
        edit: 'tab_creator/edit_peripheral',
        delete: 'tab_creator/remove_peripheral'
    },
    platform:{
        users:{
            add:'auth/user',
            delete: 'auth/user',
            need_onboarding: 'auth/onboarding',
            do_onboarding: 'auth/onboarding',
            get_list: 'auth/user'
        },
        db:{
            dump:'database/export',
            restore:'database/import'
        }
    },
    plot:{
        get_info:'plot/channels/specs',
        fetch_data:'plot/channels/data',
        set_capture: 'plot/capture',
        get_capture: 'plot/capture',
        set_channel_status: 'plot/channels/status',
        set_widths: 'plot/channels/widths',
        scaling_factors: 'plot/channels/scaling_factors'
    },
    programs:{
        get_hash:'program/hash',
        load_all: 'program/none',
        add: 'program',
        edit: 'program',
        delete: 'program',
        compile:'program/compile',
        apply: 'program/Apply'
    },
    scripts:{
        get_hash:'script/hash',
        load_all: 'script/none',
        add: 'script',
        edit: 'script',
        delete: 'script',
    },
    filters:{
        get_hash: 'filters/digest',
        load_all: 'filters/none',
        add: 'filters',
        edit: 'filters',
        delete: 'filters',
        build:'filters/build',
        get_response: "filters/response"
    }
}