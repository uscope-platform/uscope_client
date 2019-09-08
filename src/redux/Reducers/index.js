import { combineReducers} from "redux";

import channelStatusReducer from "./channelStatusReducer";
import parameterValuesReducer from "./ParameterReducers";
import registerValuesReducer from "./registerReducer"
import settingsReducer from "./settingsReducer";
export default combineReducers({
    channelStatus: channelStatusReducer,
    parameterValues: parameterValuesReducer,
    registerValues: registerValuesReducer,
    tabs: (state = {}) => state,  //dummy reducer as tabs is only loaded from server during initialization
    settings : settingsReducer
    });
