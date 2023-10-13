// Copyright 2021 University of Nottingham Ningbo China
// Author: Filippo Savi <filssavi@gmail.com>
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import {combineReducers} from "redux";

import plotReducer from "./plotReducer";
import registerValuesReducer from "./registerReducer"
import settingsReducer from "./settingsReducer";
import PeripheralsReducer from './PeripheralsReducer'
import {scriptsReducer, scriptsWorkspaceReducer} from "./scriptsReducer";
import ApplicationsReducer from './applicationsReducer'
import programsReducer from "./ProgramsReducer";
import BitstreamsReducer from "./bitstreamsReducer";
import filtersReducer from "./FiltersReducer";
import emulatorReducer from "./EmulatorReducer";
import emulatorsReducer from "./EmulatorReducer";

export default combineReducers({
    bitstreams:BitstreamsReducer,
    settings : settingsReducer,
    plot: plotReducer,
    registerValues: registerValuesReducer,
    peripherals:PeripheralsReducer,
    applications : ApplicationsReducer,
    programs : programsReducer,
    scripts: scriptsReducer,
    scriptsWorkspace: scriptsWorkspaceReducer,
    filters: filtersReducer,
    emulators: emulatorsReducer
    });
