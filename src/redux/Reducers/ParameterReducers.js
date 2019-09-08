import {SET_PARAMETER_VALUE} from "../Actions/types";



let parameterValuesReducer = function (state = null, action) {
    switch (action.type) {
        case SET_PARAMETER_VALUE:
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
