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

import React, {Suspense} from 'react';

import PlotTab from "./plot_tab_components/PlotTab";
const FilterManager = React.lazy(() => import('./Filter Designer/FilterManager'));
const ScriptManager = React.lazy(() => import('./Managers/ScriptManager'));
const PeripheralsManager = React.lazy(() => import('./Managers/PeripheralsManager'));
const ApplicationsManager = React.lazy(() => import('./Managers/ApplicationsManager'));
const ProgramsManager = React.lazy(()=> import('./Managers/ProgramsManager'));
const PlatformManager = React.lazy(()=> import('./Managers/PlatformManager'));
const BitstreamManager = React.lazy(()=> import('./Managers/BitstreamManager'));
const FcoreEmulationEditor = React.lazy(() => import('./Emulator/FcoreEmulationEditor'));

let TabContent = props => {

    let components_associations = {
        scope:<PlotTab content={props.tab}/>,
        bitstreams: <BitstreamManager />,
        scripts: <ScriptManager />,
        peripherals:<PeripheralsManager />,
        applications: <ApplicationsManager selected_item={props.selected_item}/>,
        programs: <ProgramsManager />,
        platform: <PlatformManager />,
        filters: <FilterManager />,
        emulator:<FcoreEmulationEditor/>
    };


    return (
        <Suspense fallback={<div>Loading...</div>}>
            {components_associations[props.tab.type]}
        </Suspense>
    );
};

export default TabContent;
