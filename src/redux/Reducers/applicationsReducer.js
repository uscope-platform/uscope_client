import {LOAD_APPLICATIONS, EDIT_APPLICATION, REMOVE_APPLICATION} from "../Actions/types";
import produce from "immer";


let ApplicationsReducer = function (state = [], action) {
    switch (action.type) {
        case EDIT_APPLICATION:
            switch (action.payload.action) {
                case "edit_channel":
                    return produce(state, draftState => {
                        let target = draftState[action.payload.application]["channels"].filter((item)=>{
                            return item['name'] === action.payload.channel;
                        })[0];
                        target[action.payload.field] = action.payload.value;
                    });
                case "remove_channel":
                    return produce(state, draftState => {
                        draftState[action.payload.application]["channels"] = draftState[action.payload.application]["channels"].filter((item)=>{
                            return item['name'] !== action.payload.channel;
                        });
                    });
                case "edit_irv":
                    return produce(state, draftState => {
                        let target = draftState[action.payload.application]["initial_registers_values"].filter((item)=>{
                            return item['address'] === action.payload.address;
                        })[0];
                        target[action.payload.field] = action.payload.value;
                    });
                case"remove_irv":
                    return produce(state, draftState => {
                        draftState[action.payload.application]["initial_registers_values"] = draftState[action.payload.application]["initial_registers_values"].filter((item)=>{
                            return item['address'] !== action.payload.address;
                        });
                    });
                case "edit_macro":
                    return produce(state, draftState => {
                        let target = draftState[action.payload.application]["macro"].filter((item)=>{
                            return item['name'] === action.payload.name;
                        })[0];
                        target[action.payload.field] = action.payload.value;
                    });
                case"remove_macro":
                    return produce(state, draftState => {
                        draftState[action.payload.application]["macro"] = draftState[action.payload.application]["macro"].filter((item)=>{
                            return item['name'] !== action.payload.name;
                        });
                    });
                default:
                    return state;
            }


        case LOAD_APPLICATIONS:
            state = action.payload;
            return state;
        case REMOVE_APPLICATION:
            return produce(state, draftState => {
                delete draftState[action.payload];
            });
        default:
            return state;
    }
};

export default ApplicationsReducer;
