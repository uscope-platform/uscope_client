// Copyright 2025 Filippo Savi
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

import React, {useState} from 'react';

import FcoreEmulationEditor from "./../Editor/FcoreEmulationEditor.js";
import HilEditorSidebar from "../Sidebar/per_panel_sidebars/HilEditorSidebar.jsx";
import {up_emulator, up_emulator_result} from "#client_core/index.js";
import type {EmulatorSelections} from "#interfaces/index.js";

interface HilEditorViewProps {
    set_emulation_results:  (result: up_emulator_result) => void,
    set_input_data: (data: Record<string, Record<string, number[]>>) => void,
    input_data: Record<string, number[]>,
    onDeploy: () => void,
    emulator: up_emulator,
    selections: EmulatorSelections,
    set_selections:(selection: EmulatorSelections) => void,
    bump_version: () => void,
    on_emulator_select: (emulator: number) => void,
}

let HilEditorView = function (props: HilEditorViewProps) {

    let [compiler_warnings] = useState<string[]>([]);

    return(
        <div style={{
            display:"flex",
            flexDirection:"row",
            gap:10,
            height:"100%"
        }}>
            <FcoreEmulationEditor
                onEmulationDone={props.set_emulation_results}
                onInputDataChange={props.set_input_data}
                input_data={props.input_data}
                onDeploy={props.onDeploy}
                emulator={props.emulator}
                selections={props.selections}
                on_selection={props.set_selections}
            />
            <HilEditorSidebar
                bump_version={props.bump_version}
                emulator={props.emulator}
                on_emulator_select={props.on_emulator_select}
                selections={props.selections}
                set_selections={props.set_selections}
                compile_warning={compiler_warnings}
            />
        </div>

    );
};

export default HilEditorView;
