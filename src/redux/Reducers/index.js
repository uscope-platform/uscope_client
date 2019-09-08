import { combineReducers} from "redux";
import { reducer as formReducer } from 'redux-form'

import channelStatusReducer from "./channelStatusReducer";
import parameterValuesReducer from "./ParameterReducers";
import registerValuesReducer from "./registerReducer"

export default combineReducers({
    channelStatus: channelStatusReducer,
    parameterValues: parameterValuesReducer,
    registerValues: registerValuesReducer,
    form: formReducer
    });
