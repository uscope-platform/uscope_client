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

import React from 'react';
import FcoreDebugger from "./FcoreDebugger.jsx";
import HilDebuggerSidebar from "../Sidebar/per_panel_sidebars/HilDebuggerSidebar.jsx";

let HilDebuggerView = function (props) {

    return(
        <div style={{
            display:"flex",
            flexDirection:"row",
            gap:10,
            height:"100%"
        }}>
            <FcoreDebugger
                emulator={props.emulator}
                selected_program={props.selections.program}
                on_program_select={props.on_program_select}
                translation_table={props.debugger_data.asm.translation_table}
                content={props.debugger_data}
                on_emulation_end={props.set_emulation_results}
            />
            <HilDebuggerSidebar
                emulator={props.emulator}
                selections={props.selections}
                on_selection={props.set_selections}
                on_select={props.on_select}
                on_program_select={props.on_program_select}
                compiled_programs={props.compiled_programs}
                breakpoints={props.breakpoints}
                on_add_breakpoint={props.on_add_breakpoint}
                on_remove_breakpoint={props.on_remove_breakpoint}
            />
        </div>

    );
};

export default HilDebuggerView;
