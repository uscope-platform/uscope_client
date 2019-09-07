import { combineReducers} from "redux";
import { reducer as formReducer } from 'redux-form'

import channelStatusReducer from "./channelStatusReducer";
import parameterValuesReducer from "./ParameterReducers";

export default combineReducers({
    channelStatus: channelStatusReducer,
    parameterValues: parameterValuesReducer,
    form: formReducer
    });
