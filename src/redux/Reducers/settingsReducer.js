import {SET_SETTING} from "../Actions/types";
import produce from "immer";
import {ColorTheme} from "../../components/UI_elements";

const initial_state = {
    default_tab: "Plot",
    refreshRate: 125,
    edit_application_mode:false,
    edit_application_name: "",
    default_ch_group:'',
    current_peripheral:null,
    current_application:null,
    selected_script:null,
    script_editor_title:null,
    current_view_requires_sidebar: true,
    selected_program: null,
    program_editor_title: null,
    selected_user:null,
    refresh_user_view:false,
    app_stage:"WAITING",
    logged:false,
    server_url: process.env.REACT_APP_SERVER,
    auth_config:null,
    sampling_period:0,
    plot_palette:ColorTheme.plot_palette
};

let settingsReducer = function (state = initial_state, action) {
    switch (action.type) {
        case SET_SETTING:
            return produce(state, draftState => {
                draftState[action.payload.name] = action.payload.value;
            });
        default:
            return state;
    }
};

export default settingsReducer;
