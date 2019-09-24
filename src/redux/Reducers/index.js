import { combineReducers} from "redux";

import plotReducer from "./plotReducer";
import parameterValuesReducer from "./ParameterReducers";
import registerValuesReducer from "./registerReducer"
import settingsReducer from "./settingsReducer";
import tabsReducer from "./tabsReducer";
import modalsReducer from "./modalsReducer";
import {scriptsReducer, scriptsWorkspaceReducer} from "./scriptsReducer";


export default combineReducers({
    plot: plotReducer,
    parameterValues: parameterValuesReducer,
    registerValues: registerValuesReducer,
    tabs: tabsReducer,
    settings : settingsReducer,
    modals : modalsReducer,
    scripts: scriptsReducer,
    scriptsWorkspace: scriptsWorkspaceReducer
    });
