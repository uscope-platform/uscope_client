import {LOAD_PARAMETERS_DONE, SAVE_PARAMETER} from "../Actions/types";



let parameterValuesReducer = function (state = null, action) {
    switch (action.type) {
        case LOAD_PARAMETERS_DONE:
            state = action.payload;
            return state;
        case SAVE_PARAMETER:
            return state.map(parameter => {
                if (parameter.parameter_name === action.payload.name) {
                    return {...parameter, value:  action.payload.value}
                }
                return parameter;
            });
        default:
            return state;
    }
};

export default parameterValuesReducer;
