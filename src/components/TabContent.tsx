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

import PlotTab from "./Views/Plot/PlotTab.jsx";

const FilterManager = React.lazy(() => import('./Views/Filters/FilterManager.jsx'));
const ScriptManager = React.lazy(() => import('./Views/Scripts/ScriptManager.jsx'));
const PeripheralsManager = React.lazy(() => import('./Views/Peripherals/PeripheralsManager.jsx'));
const ApplicationsManager = React.lazy(() => import('./Views/Applications/ApplicationsManager.jsx'));
const ProgramsManager = React.lazy(()=> import('./Views/Programs/ProgramsManager.jsx'));
const PlatformManager = React.lazy(()=> import('./Views/Platform/PlatformManager.jsx'));
const BitstreamManager = React.lazy(()=> import('./Views/Bitstreams/BitstreamManager.jsx'));
const HilView = React.lazy(() => import('./Views/Emulators/HilView.jsx'));
const SettingsView = React.lazy(() => import('./Views/Settings/Settings_view.jsx'));

interface TabContentProps {
    tab: any;
    selected_item: any;
}

let TabContent = (props: TabContentProps) => {

    let components_associations : any = {
        scope:<PlotTab
            content={props.tab}
        />,
        bitstreams: <BitstreamManager />,
        scripts: <ScriptManager/>,
        peripherals:<PeripheralsManager />,
        applications: <ApplicationsManager selected_item={props.selected_item}/>,
        programs: <ProgramsManager/>,
        platform: <PlatformManager />,
        filters: <FilterManager />,
        emulator:<HilView/>,
        settings:<SettingsView />
    };


    return (
        <Suspense fallback={<div>Loading...</div>}>
            {components_associations[props.tab.type]}
        </Suspense>
    );
};

export default TabContent;
