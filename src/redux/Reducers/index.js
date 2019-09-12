import { combineReducers} from "redux";

import channelStatusReducer from "./channelStatusReducer";
import parameterValuesReducer from "./ParameterReducers";
import registerValuesReducer from "./registerReducer"
import settingsReducer from "./settingsReducer";
import tabsReducer from "./tabsReducer";


export default combineReducers({
    channels: channelStatusReducer,
    parameterValues: parameterValuesReducer,
    registerValues: registerValuesReducer,
    tabs: tabsReducer,
    settings : settingsReducer
    });
