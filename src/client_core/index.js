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


export {run_script, run_parameter_script, initialize_scripting_engine} from './scripting/script_runner'
export {construct_proxied_register, set_write_callback} from './data_models/register_proxy'
export {autocompletion_engine} from './scripting/autocompletion_engine'
export {refresh_caches, get_ui_state, save_ui_state} from './cache_handling'
export {init_terminal} from './terminal/terminal'
// SERVER PROXY
export {set_address, set_auth_config} from './proxy/backend'

export {sign_in} from './proxy/auth'
export {add_user, remove_user, get_users_list, dump_database, restore_database, do_onboarding, need_onboarding} from './proxy/platform'
export { set_channel_status, set_scaling_factors, direct_fetch} from './proxy/plot'


// DATA MODEL
export {up_application} from './data_models/up_application'
export {up_peripheral} from './data_models/up_peripheral'
export {up_field} from './data_models/up_field'
export {up_script} from './data_models/up_script'
export {up_filter} from  './data_models/up_filter'
export {up_program} from './data_models/up_program'
export {up_bitstream} from './data_models/up_bitstream'
export {up_register} from  './data_models/up_register'
export {up_emulator} from './data_models/emulator/up_emulator'
export {up_emulator_result} from './data_models/emulator/up_emulation_result.js'
export {application_diff_engine} from './data_models/diff_engine'
//filter
export {filter_calculate_keepouts} from './filters/filter_preview'

export let store = null;
export let __selected_application = null;

export {import_application, import_peripherals} from './data_handling/import'
export {get_next_id} from './utilities/id_management'
export {download_json, download_plot, download_bitstream} from './utilities/downloads'
export {upload_json, upload_raw} from './utilities/uploads'
export {get_channel_number_from_id, get_channels_from_group, create_plot_channel, initialize_plot} from "./plot_handling";

export const set_redux_store = (rs) => {
    store = rs;
}

export const setup_client_core = (app) => {
    __selected_application = app;
}