// Copyright 2021 University of Nottingham Ningbo China
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

import {SET_SETTING} from "../Actions/types";
import {ColorTheme} from "../../components/UI_elements";

const initial_state = {
    default_tab: "Plot",
    refreshRate: 125,
    edit_application_mode:false,
    edit_application_name: "",
    default_ch_group:'',
    current_peripheral:null,
    current_view_requires_sidebar: true,
    selected_program: null,
    selected_application:null,
    selected_script:null,
    selected_bitstream:null,
    selected_user:null,
    selected_filter:null,
    selected_emulator:null,
    emulator_selected_component:null,
    emulator_selected_iom:null,
    refresh_user_view:false,
    logged:false,
    server_url: import.meta.env.VITE_APP_SERVER,
    auth_config:null,
    user_role:null,
    sampling_period:0,
    plot_palette:{colorway:ColorTheme.plot_palette}
};

let settingsReducer = function (state = initial_state, action) {
    switch (action.type) {
        case SET_SETTING:
            return {
                ...state,
                [action.payload.name]:action.payload.value
            }
        default:
            return state;
    }
};

export default settingsReducer;
