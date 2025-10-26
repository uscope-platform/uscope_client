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


import type {up_application} from "#client_core/data_models/up_application.js";

export {run_script, run_parameter_script, initialize_scripting_engine} from './scripting/script_runner.js'
export {construct_proxied_register, set_write_callback} from './data_models/register_proxy.js'
export {autocompletion_engine} from './scripting/autocompletion_engine.js'
export {refresh_caches, get_ui_state, save_ui_state} from './cache_handling.js'
export {init_terminal} from './terminal/terminal.js'
// SERVER PROXY
export {set_address, set_auth_config} from './proxy/backend.js'

export {add_user, remove_user, get_users_list, dump_database, restore_database, do_onboarding, need_onboarding} from './proxy/platform.js'
export { set_channel_status, set_scaling_factors, direct_fetch, set_acquisition, get_acquisition_status} from './proxy/plot.js'


// DATA MODEL
export {up_application, empty_channel_group} from './data_models/up_application.js'
export {up_peripheral} from './data_models/up_peripheral.js'
export {up_field} from './data_models/up_field.js'
export {up_script} from './data_models/up_script.js'
export {up_filter} from  './data_models/up_filter.js'
export {up_program} from './data_models/up_program.js'
export {up_bitstream} from './data_models/up_bitstream.js'
export {up_register} from  './data_models/up_register.js'
export {up_emulator} from './data_models/emulator/up_emulator.js'
export {up_emulator_result} from './data_models/emulator/up_emulation_result.js'
export {up_settings} from './data_models/up_settings.js'

//filter
export {filter_calculate_keepouts} from './filters/filter_preview.js'

export let store = null;
export let __selected_application: up_application;

export {import_application, import_peripherals} from './data_handling/import.js'
export {get_next_id} from './utilities/id_management.js'
export {download_json, download_plot, download_bitstream,download_text} from './utilities/downloads.js'
export {upload_json, upload_raw} from './utilities/uploads.js'
export {get_channel_number_from_id, get_channels_from_group, create_plot_channel, initialize_plot, update_plot_status, update_plot_data} from "./plot_handling.js";

export const set_redux_store = (rs: any) => {
    store = rs;
}

export const setup_client_core = (app: up_application) => {
    __selected_application = app;
}