import {SHOW_MODAL, HIDE_MODAL} from "../Actions/types";
import produce from "immer";

const initial_state = {
    application_choice:false,
    timebase_choice:false,
    scope_mode_choice:false,
    channel_settings_choice: [false, false, false,false, false, false],
    peripheral_creator_image_choice: false,
    peripheral_creator_register_modal: false,
    peripheral_creator_app_param_modal:false,
    app_creator_peripheral_modal:false,
    app_creator_parameter_modal:false,
    app_creator_macro_modal:false,
    app_creator_channel_modal:false,
    app_creator_app_name_modal:false,
    app_creator_IRV_modal: false
};

let modalsReducer = function (state = initial_state, action) {
    switch (action.type) {
        case SHOW_MODAL:
            return produce(state, draftState => {
                if(action.payload.idx===-1){
                    draftState[action.payload.name] = action.payload.value;
                } else{
                    draftState[action.payload.name][action.payload.idx] = action.payload.value;
                }
            });
        case HIDE_MODAL:
            return produce(state, draftState => {
                if(action.payload.idx===-1){
                    draftState[action.payload.name] = action.payload.value;
                } else{
                    draftState[action.payload.name][action.payload.idx] = action.payload.value;
                }
            });
        default:
            return state;
    }
};

export default modalsReducer;
