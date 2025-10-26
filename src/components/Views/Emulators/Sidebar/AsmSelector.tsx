// Copyright 2024 Filippo Savi
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

import {SelectableList, SimpleContent, UIPanel} from "#UI/index.js";
import type {DecompiledPrograms} from "#interfaces/emulator_view.js";

interface AsmSelectorProps {
    on_select: (value: string)=>void;
    selected_program: string,
    programs: Record<string, DecompiledPrograms>
}

let  AsmSelector = (props: AsmSelectorProps) =>{


    let handle_select = (item: string) =>{
        props.on_select(item);
    }

    return(
        <UIPanel key="programs_list" style={{minHeight:"200px"}} level="level_2">
            <SimpleContent name={"Disassembled program Selector"}>
                <SelectableList
                    items={Object.keys(props.programs)}
                    selected_item={props.selected_program}
                    onSelect={handle_select}
                />
            </SimpleContent>
        </UIPanel>

    )

};

export default AsmSelector;
