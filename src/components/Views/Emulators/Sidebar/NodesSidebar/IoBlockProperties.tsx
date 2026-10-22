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

import {useState} from "react";
import {Checkbox, FieldGrid, FieldPane, FieldSpan, InputField, SelectableList, SelectField, SimpleContent, UIPanel} from "#UI/index.js";
import {MdAdd} from "react-icons/md";
import {up_emulator} from "#client_core/index.js";
import type {io_block, io_port, SimpleStringOption} from "#interfaces/index.js";

interface IoBlockPropertiesProps {
    selected_block: io_block,
    selected_emulator: up_emulator,
    bump_version: () => void,
}

const hex = (value: number) => "0x" + value.toString(16);

/// The problems of the endpoints that the toolchain would refuse, shown as they are found
const find_problems = (block: io_block, emulator: up_emulator): string[] => {
    const problems: string[] = [];
    for(const port of block.ports){
        if(port.address % 4 !== 0) problems.push(port.name + " is not aligned to a 32 bit word");
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

let IoBlockProperties = (props: IoBlockPropertiesProps) =>{

    const block = props.selected_block;
    const [selected_port_name, set_selected_port_name] = useState<string | undefined>(undefined);
    const selected_port = block.ports.find((p) => p.name === selected_port_name);

    const handle_block_change = async (event: React.KeyboardEvent<HTMLInputElement>) =>{
        if(event.key==="Enter"|| event.key ==="Tab") {
            await props.selected_emulator.edit_io_block_props(block.id, "name", event.currentTarget.value);
            props.bump_version();
        }
    }

    const handle_port_change = async (event: React.KeyboardEvent<HTMLInputElement>) =>{
        if(event.key==="Enter"|| event.key ==="Tab") {
            if(!selected_port) return;
            const field = event.currentTarget.name as keyof io_port;
            const value = event.currentTarget.value;
            if(field === "name"){
                await props.selected_emulator.edit_io_port(block.id, selected_port.name, field, value);
                set_selected_port_name(value);
            } else if(field === "address" || field === "width"){
                const number = parseInt(value);
                if(Number.isNaN(number) || number < 0) return;
                await props.selected_emulator.edit_io_port(block.id, selected_port.name, field, number);
            }
            props.bump_version();
        }
    }

    const handle_type = (selection: SimpleStringOption | null) =>{
        if(selection === null || !selected_port) return;
        props.selected_emulator.edit_io_port(block.id, selected_port.name, "type", selection.value).then(() =>{
            props.bump_version();
        });
    }

    const handle_signed = (event: React.ChangeEvent<HTMLInputElement>) =>{
        if(!selected_port) return;
        props.selected_emulator.edit_io_port(block.id, selected_port.name, "signed", event.target.checked).then(() =>{
            props.bump_version();
        });
    }

    const handle_add_port = () =>{
        props.selected_emulator.add_io_port(block.id).then((updated) =>{
            set_selected_port_name(updated.ports.at(-1)?.name);
            props.bump_version();
        });
    }

    const handle_remove_port = (name: string) =>{
        props.selected_emulator.remove_io_port(block.id, name).then(() =>{
            if(name === selected_port_name) set_selected_port_name(undefined);
            props.bump_version();
        });
    }

    const render_port = () =>{
        if(!selected_port) return;
        return(
            <UIPanel key="io_port_properties" level="level_2">
                <SimpleContent name={"Endpoint Properties"}>
                    <FieldPane key={block.id + "." + selected_port.name}>
                        <FieldGrid>
                            <FieldSpan>
                                <InputField id="name" name="name" label="Endpoint name" defaultValue={selected_port.name} onKeyDown={handle_port_change}/>
                            </FieldSpan>
                            <FieldSpan>
                                <InputField id="address" name="address" label="Bus address" defaultValue={hex(selected_port.address)} onKeyDown={handle_port_change}/>
                            </FieldSpan>
                            <FieldSpan>
                                <SelectField<SimpleStringOption>
                                    stacked
                                    label="Data type on the bus"
                                    onChange={handle_type}
                                    value={{label: selected_port.type, value: selected_port.type}}
                                    name="type"
                                    options={[{label: "float", value: "float"}, {label: "integer", value: "integer"}]}/>
                            </FieldSpan>
                            {selected_port.type === "integer" && <>
                                <InputField id="width" name="width" label="Width (bits)" defaultValue={selected_port.width.toString()} onKeyDown={handle_port_change}/>
                                <Checkbox name="signed" value={selected_port.signed} onChange={handle_signed} label="Signed"/>
                            </>}
                        </FieldGrid>
                    </FieldPane>
                </SimpleContent>
            </UIPanel>
        )
    }

    const problems = find_problems(block, props.selected_emulator);

    return(
        <div style={{
            display: "flex",
            flexDirection: "column",
            gap:10
        }}>
            <UIPanel key="io_block_properties" level="level_2">
                <SimpleContent name={block.direction === "source" ? "IO Source Properties" : "IO Sink Properties"}>
                    <FieldPane key={"io_block_" + block.id}>
                        <FieldGrid>
                            <FieldSpan>
                                <InputField id="name" name="name" label="Block name" defaultValue={block.name} onKeyDown={handle_block_change}/>
                            </FieldSpan>
                        </FieldGrid>
                    </FieldPane>
                    {problems.map((p) => <div key={p} style={{margin: "0.25em 0.5em", fontSize: "0.8rem"}}>{p}</div>)}
                </SimpleContent>
            </UIPanel>
            <UIPanel style={{minHeight:"150px"}} key="io_ports" level="level_2">
                <SimpleContent name={"Endpoints"}>
                    <div style={{display: "flex", flexDirection: "row", marginTop: "0.25em"}}>
                        <MdAdd style={{marginLeft: "auto"}} onClick={handle_add_port}/>
                    </div>
                    <SelectableList
                        items={block.ports.map((p) => p.name)}
                        selected_item={selected_port_name}
                        onSelect={set_selected_port_name}
                        onRemove={handle_remove_port}
                    />
                </SimpleContent>
            </UIPanel>
            {render_port()}
        </div>
    );
};

export default IoBlockProperties;
