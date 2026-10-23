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


import {up_emulator} from "#client_core/index.js";
import {SidebarColumn} from "#UI/index.js";
import EmulatorList from "../EmulatorList.jsx";
import AsmSelector from "./../AsmSelector.jsx";
import BreakpointsPanel from "./../BreakpointsPanel.jsx";
import type {EmulatorSelections} from "#interfaces/index.js";
import type {DecompiledPrograms} from "#interfaces/emulator_view.js";

interface HilDebuggerSidebarProps {
    emulator: up_emulator;
    on_select: (sel: number) => void,
    set_selections: (sel:EmulatorSelections)=>void,
    selections: EmulatorSelections,
    on_program_select: (program:string)=>void,
    compiled_programs: Record<string, DecompiledPrograms>
    on_add_breakpoint: (value: number) => void,
    on_remove_breakpoint: (value: number) => void,
    breakpoints: number[],
}

let  HilDebuggerSidebar = (props: HilDebuggerSidebarProps) =>{


    let handle_select_emulator = (sel: number) =>{
        props.on_select(sel);
        props.set_selections({...props.selections, iom:null})
    }

    return(
        <SidebarColumn panels={[
            {title: "Emulator List", content: (
                <EmulatorList on_select={handle_select_emulator}/>
            )},
            {title: "Program", content: (
                <AsmSelector
                    programs={props.compiled_programs}
                    selected_program={props.selections.program}
                    on_select={props.on_program_select}
                />
            )},
            {title: "Breakpoints", content: (
                <BreakpointsPanel
                    breakpoints={props.breakpoints}
                    on_add={props.on_add_breakpoint}
                    on_remove={props.on_remove_breakpoint}
                />
            )}
        ]}/>
    );

};

export default HilDebuggerSidebar;
