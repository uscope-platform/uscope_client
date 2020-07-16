import {combineReducers} from "redux";

import plotReducer from "./plotReducer";
import parameterValuesReducer from "./ParameterReducers";
import registerValuesReducer from "./registerReducer"
import settingsReducer from "./settingsReducer";
import tabsReducer from "./tabsReducer";
import modalsReducer from "./modalsReducer";
import PeripheralsReducer from './PeripheralsReducer'
import {scriptsReducer, scriptsWorkspaceReducer} from "./scriptsReducer";
import ApplicationsReducer from './applicationsReducer'

export default combineReducers({
    plot: plotReducer,
    parameterValues: parameterValuesReducer,
    registerValues: registerValuesReducer,
    peripherals:PeripheralsReducer,
    tabs: tabsReducer,
    settings : settingsReducer,
    modals : modalsReducer,
    applications : ApplicationsReducer,
    scripts: scriptsReducer,
    scriptsWorkspace: scriptsWorkspaceReducer
    });
