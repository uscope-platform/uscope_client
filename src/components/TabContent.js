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
const ScriptManager = React.lazy(() => import('./Managers/ScriptManager'));
const PeripheralsManager = React.lazy(() => import('./Managers/PeripheralsManager'));
const ApplicationsManager = React.lazy(() => import('./Managers/ApplicationsManager'));
const ProgramsManager = React.lazy(()=> import('./Managers/ProgramsManager'));
const PlatformManager = React.lazy(()=> import('./Managers/PlatformManager'));
const BitstreamManager = React.lazy(()=> import('./Managers/BitstreamManager'));

let TabContent = props => {
    if(props.tab.type==='Scope'){
        return(
            <Suspense fallback={<div>Loading...</div>}>
                <PlotTab content={props.tab}/>
            </Suspense>
        );
    } else if(props.tab.type ==='bitstream_manager'){
        return (
            <Suspense fallback={<div>Loading...</div>}>
                <BitstreamManager />
            </Suspense>
        );
    }else if(props.tab.type ==='script_manager'){
        return (
            <Suspense fallback={<div>Loading...</div>}>
                <ScriptManager />
            </Suspense>
        );
    }else if(props.tab.type ==='peripherals_manager'){
        return (
            <Suspense fallback={<div>Loading...</div>}>
                <PeripheralsManager />
            </Suspense>
        );
    }else if(props.tab.type ==='applications_manager'){
        return (
            <Suspense fallback={<div>Loading...</div>}>
                <ApplicationsManager selected_item={props.selected_item}/>
            </Suspense>
        );
    }else if(props.tab.type ==='program_manager'){
        return (
            <Suspense fallback={<div>Loading...</div>}>
                <ProgramsManager />
            </Suspense>
        );
    }else if(props.tab.type ==='platform_manager'){
        return (
            <Suspense fallback={<div>Loading...</div>}>
                <PlatformManager />
            </Suspense>
        );
    }else{
        return null
    }
};

export default TabContent;
