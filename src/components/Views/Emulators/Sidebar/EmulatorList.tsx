// Copyright 2026 Filippo Savi
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

import React from 'react';

import {up_emulator} from "#client_core/index.js";
import {SidebarBase} from "#UI/index.js";
import {useAppSelector} from "#redux/hooks.js";

interface EmulatorListProps {
    on_select: (emulator: number) => void,
}

/// The list of the emulators, the first panel of the sidebars of the emulator views
let EmulatorList = (props: EmulatorListProps) =>{

    const emulators_store = useAppSelector(state => state.emulators);

    return(
        <SidebarBase
            objects={emulators_store}
            selection_key="id"
            template={up_emulator}
            display_key="name"
            content_name="Emulator"
            onSelect={props.on_select}
        />
    );
};

export default EmulatorList;
