import {LOAD_PARAMETERS_DONE, SEND_PARAMETER} from "../Actions/types";



let parameterValuesReducer = function (state = null, action) {
    switch (action.type) {
        case LOAD_PARAMETERS_DONE:
            state = action.payload;
            return state;
        case SEND_PARAMETER:
            return state.map(parameter => {
                if (parameter.qualified_name === action.payload.name) {
                    return {...parameter, value:  action.payload.value}
                }
                return parameter;
            });
        default:
            return state;
    }
};

export default parameterValuesReducer;
