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
export {construct_proxied_register} from './data_models/register_proxy'
export {autocompletion_engine} from './scripting/autocompletion_engine'
export {refresh_caches} from './cache_handling'
export {init_terminal} from './terminal/terminal'
// SERVER PROXY
export {set_address, set_auth_config} from './proxy/backend'

export {sign_in} from './proxy/auth'
export {add_user, remove_user, get_users_list, dump_database, restore_database, do_onboarding, need_onboarding} from './proxy/platform'
export {fetch_data, set_channel_status, set_channel_widths, create_plot_channel, get_channels_from_group, get_channel_number_from_id} from './proxy/plot'
// DATA MODEL
export {up_application} from './data_models/up_application'
export {up_peripheral} from './data_models/up_peripheral'
export {up_field} from './data_models/up_field'
export {up_script} from './data_models/up_script'
export {up_program} from './data_models/up_program'
export {up_bitstream} from './data_models/up_bitstream'
export {up_register} from  './data_models/up_register'

export let store = null;

export {import_application, import_peripherals} from './data_handling/import'

export const set_redux_store = (rs) => {
    store = rs;
}