import {combineReducers} from "redux";

import plotReducer from "./plotReducer";
import registerValuesReducer from "./registerReducer"
import settingsReducer from "./settingsReducer";
import viewsReducer from "./viewsReducer";
import modalsReducer from "./modalsReducer";
import PeripheralsReducer from './PeripheralsReducer'
import {scriptsReducer, scriptsWorkspaceReducer} from "./scriptsReducer";
import ApplicationsReducer from './applicationsReducer'

export default combineReducers({
    plot: plotReducer,
    registerValues: registerValuesReducer,
    peripherals:PeripheralsReducer,
    views: viewsReducer,
    settings : settingsReducer,
    modals : modalsReducer,
    applications : ApplicationsReducer,
    scripts: scriptsReducer,
    scriptsWorkspace: scriptsWorkspaceReducer
    });
