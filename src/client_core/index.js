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





export {run_script, run_parameter_script} from './script_runner'
export {refresh_caches} from './cache_handling'
export {init_terminal} from './terminal/terminal'
// SERVER PROXY
export {set_address, set_auth_config} from './proxy/backend'
export {upload_bitstream, delete_bitstream, edit_bitstream} from './proxy/bitstreams'

export {sign_in} from './proxy/auth'
export {add_user, remove_user, get_users_list, dump_database, restore_database, do_onboarding, need_onboarding} from './proxy/platform'
export {fetch_data, get_captured_data, set_capture, get_channel_info, set_channel_status, set_channel_widths} from './proxy/plot'
// DATA MODEL
export {up_application} from './data_models/up_application'
export {up_peripheral} from './data_models/up_peripheral'
export let store = null;

export const set_redis_store = (rs) => {
    store = rs;
}