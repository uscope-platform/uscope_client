import {EDIT_PERIPHERAL, LOAD_PERIPHERALS, REMOVE_PERIPHERAL} from "../Actions/types";
import produce from "immer";


let PeripheralsReducer = function (state = null, action) {
    switch (action.type) {
        case LOAD_PERIPHERALS:
            state = action.payload;
            return state;
        case EDIT_PERIPHERAL:
            switch (action.payload.action) {
                case "edit_register":
                    return produce(state, draftState => {
                        let reg = draftState[action.payload.peripheral]["registers"].filter((item)=>{
                            return item.register_name===action.payload.register;
                        })[0];
                        reg[action.payload.field] = action.payload.value;
                        return draftState
                    });
                case "add_register":
                    return produce(state, draftState => {
                        let reg = draftState[action.payload.peripheral]["registers"].push(action.payload.register)
                        return draftState
                    });
                case "remove_register":
                    return produce(state, draftState => {
                        let regs = draftState[action.payload.peripheral]["registers"].filter((item)=>{
                            return item.register_name!==action.payload.register;
                        });
                        draftState[action.payload.peripheral]["registers"] = regs;
                        return draftState
                    });
                case "change_image":
                    return produce(state, draftState => {
                        let periph = draftState[action.payload.peripheral]
                        let image_path = periph.image.substring(0, periph.image.lastIndexOf("/"));
                        periph.image = image_path+"/"+action.payload.path;
                        return draftState
                    });
                default:
                    return state;

            }

        case REMOVE_PERIPHERAL:
            return produce(state, draftState => {
                delete draftState[action.payload];
            });
        default:
            return state;
    }
};

export default PeripheralsReducer;
