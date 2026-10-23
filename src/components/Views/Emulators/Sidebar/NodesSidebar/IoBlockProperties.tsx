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

import {Checkbox, FieldGrid, FieldPane, FieldSpan, InputField, SelectableList, SelectField} from "#UI/index.js";
import {MdAdd} from "react-icons/md";
import {up_emulator} from "#client_core/index.js";
import type {io_block, io_port, SimpleStringOption} from "#interfaces/index.js";

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

interface IoEndpointsProps extends IoBlockProps {
    selected_port_name: string | undefined,
    on_select_port: (name: string | undefined) => void,
}

/// The endpoints of an IO block, to pick the one to edit
export let IoEndpointsList = (props: IoEndpointsProps) =>{

    const block = props.block;

    const handle_add_port = () =>{
        props.emulator.add_io_port(block.id).then((updated) =>{
            props.on_select_port(updated.ports.at(-1)?.name);
            props.bump_version();
        });
    }

    const handle_remove_port = (name: string) =>{
        props.emulator.remove_io_port(block.id, name).then(() =>{
            if(name === props.selected_port_name) props.on_select_port(undefined);
            props.bump_version();
        });
    }

    return(
        <>
            <div style={{display: "flex", flexDirection: "row", marginTop: "0.25em"}}>
                <MdAdd style={{marginLeft: "auto"}} onClick={handle_add_port}/>
            </div>
            <SelectableList
                items={block.ports.map((p) => p.name)}
                selected_item={props.selected_port_name}
                onSelect={props.on_select_port}
                onRemove={handle_remove_port}
            />
        </>
    );
};

interface IoEndpointFieldsProps extends IoBlockProps {
    port: io_port,
    on_rename_port: (name: string) => void,
}

/// The fields of one endpoint of an IO block
export let IoEndpointFields = (props: IoEndpointFieldsProps) =>{

    const block = props.block;
    const port = props.port;

    const handle_port_change = async (event: React.KeyboardEvent<HTMLInputElement>) =>{
        if(event.key==="Enter"|| event.key ==="Tab") {
            const field = event.currentTarget.name as keyof io_port;
            const value = event.currentTarget.value;
            if(field === "name"){
                await props.emulator.edit_io_port(block.id, port.name, field, value);
                props.on_rename_port(value);
            } else if(field === "address" || field === "width"){
                const number = parseInt(value);
                if(Number.isNaN(number) || number < 0) return;
                await props.emulator.edit_io_port(block.id, port.name, field, number);
            }
            props.bump_version();
        }
    }

    const handle_type = (selection: SimpleStringOption | null) =>{
        if(selection === null) return;
        props.emulator.edit_io_port(block.id, port.name, "type", selection.value).then(() =>{
            props.bump_version();
        });
    }

    const handle_signed = (event: React.ChangeEvent<HTMLInputElement>) =>{
        props.emulator.edit_io_port(block.id, port.name, "signed", event.target.checked).then(() =>{
            props.bump_version();
        });
    }

    return(
        <FieldPane key={block.id + "." + port.name}>
            <FieldGrid>
                <FieldSpan>
                    <InputField id="name" name="name" label="Endpoint name" defaultValue={port.name} onKeyDown={handle_port_change}/>
                </FieldSpan>
                <FieldSpan>
                    <InputField id="address" name="address" label="Bus address" defaultValue={port.address.toString()} onKeyDown={handle_port_change}/>
                </FieldSpan>
                <FieldSpan>
                    <SelectField<SimpleStringOption>
                        stacked
                        label="Data type on the bus"
                        onChange={handle_type}
                        value={{label: port.type, value: port.type}}
                        name="type"
                        options={[{label: "float", value: "float"}, {label: "integer", value: "integer"}]}/>
                </FieldSpan>
                {port.type === "integer" && <>
                    <InputField id="width" name="width" label="Width (bits)" defaultValue={port.width.toString()} onKeyDown={handle_port_change}/>
                    <Checkbox name="signed" value={port.signed} onChange={handle_signed} label="Signed"/>
                </>}
            </FieldGrid>
        </FieldPane>
    );
};
