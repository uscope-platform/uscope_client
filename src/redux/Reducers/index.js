import { combineReducers} from "redux";

import channelStatusReducer from "./channelStatusReducer";
import parameterValuesReducer from "./ParameterReducers";
import registerValuesReducer from "./registerReducer"
import settingsReducer from "./settingsReducer";
import tabsReducer from "./tabsReducer";


export default combineReducers({
    channelStatus: channelStatusReducer,
    parameterValues: parameterValuesReducer,
    registerValues: registerValuesReducer,
    tabs: tabsReducer,  //dummy reducer as tabs is only loaded from server during initialization
    settings : settingsReducer
    });
