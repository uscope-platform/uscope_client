import {SET_PARAMETER_VALUE} from "../reduxActions/types";



let parameterValuesReducer = function (state = null, action) {
    switch (action.type) {
        case SET_PARAMETER_VALUE:
            return state.map(parameter => {
                if (parameter.name === action.payload.name) {
                    return {...parameter, value:  action.payload.enabled}
                }
                return parameter;
            });
        default:
            return state;
    }
};

export default parameterValuesReducer;
