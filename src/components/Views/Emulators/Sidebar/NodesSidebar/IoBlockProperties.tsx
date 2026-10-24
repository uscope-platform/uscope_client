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

import {up_emulator} from "#client_core/index.js";
import type {io_block} from "#interfaces/index.js";

interface IoBlockProps {
    block: io_block,
    emulator: up_emulator,
    bump_version: () => void,
}

/// The problems of the endpoints that the toolchain would refuse, shown as they are found
const find_problems = (block: io_block, emulator: up_emulator): string[] => {
    const problems: string[] = [];
    for(const port of block.ports){
        for(const other of Object.values(emulator.io_blocks)){
            for(const other_port of other.ports){
                if(other_port === port || (other.id === block.id && other_port.name === port.name)) continue;
                if(other_port.address === port.address){
                    problems.push(port.name + " has the same address as " + other.name + "." + other_port.name);
                }
            }
        }
    }
    const names = block.ports.map((p) => p.name);
    if(new Set(names).size !== names.length) problems.push("Two endpoints have the same name");
    return problems;
}

/// The problems of the endpoints of an IO block
export let IoBlockFields = (props: IoBlockProps) =>{

    const block = props.block;

    const problems = find_problems(block, props.emulator);

    return(
        <>
            {problems.length === 0 && <div style={{margin: "0.5em", fontSize: "0.8rem", opacity: 0.6}}>No problems found.</div>}
            {problems.map((p) => <div key={p} style={{margin: "0.25em 0.5em", fontSize: "0.8rem"}}>{p}</div>)}
        </>
    );
};
