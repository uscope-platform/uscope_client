import {combineReducers} from "redux";

import plotReducer from "./plotReducer";
import registerValuesReducer from "./registerReducer"
import settingsReducer from "./settingsReducer";
import viewsReducer from "./viewsReducer";
import PeripheralsReducer from './PeripheralsReducer'
import {scriptsReducer, scriptsWorkspaceReducer} from "./scriptsReducer";
import ApplicationsReducer from './applicationsReducer'
import programsReducer from "./ProgramsReducer";

export default combineReducers({
    settings : settingsReducer,
    plot: plotReducer,
    registerValues: registerValuesReducer,
    peripherals:PeripheralsReducer,
    views: viewsReducer,
    applications : ApplicationsReducer,
    programs : programsReducer,
    scripts: scriptsReducer,
    scriptsWorkspace: scriptsWorkspaceReducer
    });
