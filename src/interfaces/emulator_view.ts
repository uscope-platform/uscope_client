/*
 * Copyright(c) 2025. Filippo Savi
 * Author: Filippo Savi <filssavi@gmail.com>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */

export interface EmulatorResultLegendItem{
    name:string,
    index: number
}

export interface EmulatorHilInput{
    core:string,
    name:string,
    value:number[]
}

export interface EmulatorHilChannelIdentifier{
    label:string,
    core:string,
    name:string,
    channel:number
}


export interface EmulatorIomSelector{
    type: "inputs" | "outputs" | "memory_init",
    obj: string
}

export interface EmulatorGraphNode{
    id:number,
    text:string
}

export interface EmulatorGraphEdge{
    id:number,
    from:number,
    to:number
}
interface EmulatorComponentSelectorBase {
    type: string;
    obj: EmulatorGraphNode | EmulatorGraphEdge;
}

export interface EmulatorNodeSelector extends EmulatorComponentSelectorBase {
    type: "node";
    obj: EmulatorGraphNode;
}

export interface EmulatorEdgeSelector extends EmulatorComponentSelectorBase {
    type: "edge";
    obj: EmulatorGraphEdge;
}

export type EmulatorComponentSelector =
    | EmulatorNodeSelector
    | EmulatorEdgeSelector;

export interface EmulatorSelections{
    component: EmulatorComponentSelector | null,
    iom:EmulatorIomSelector | null,
    tab:number,
    program:string,
    obj_version:number
}

export interface IoAddressMapping{
    name:string,
    address:number
}


export type TranslationTableEntry = [number, IoAddressMapping]


export interface DecompiledPrograms {
    translation_table: TranslationTableEntry[],
    common_io_translation_table:  TranslationTableEntry[],
    program:string
}

export interface SingleProgramDataPackage{
    asm: DecompiledPrograms,
    source: string
}

export interface DebuggerDataPackage {
    asm: Record<string, DecompiledPrograms>,
    source:string
}

export interface DebuggerCheckpoint {
    breakpoint:number
    memory_view:number[],
    inputs:Record<string, number>,
    status:string,
    core_name:string,
    next_program:string,
    progress:{
        current:number,
        total_steps:number,
        period:number
    },
    completed_round:boolean
}