import { combineReducers} from "redux";

import channelStatusReducer from "./channelStatusReducer";
import parameterValuesReducer from "./ParameterReducers";
import registerValuesReducer from "./registerReducer"

export default combineReducers({
    channelStatus: channelStatusReducer,
    parameterValues: parameterValuesReducer,
    registerValues: registerValuesReducer,
    tabs: (state = {}) => state,  //dummy reducer as tabs is only loaded from server during initialization
    settings : (state = {}) => state //dummy reducer as settings is only loaded from server during initialization
    });
