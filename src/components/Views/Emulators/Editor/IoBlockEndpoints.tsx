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


import React, {useState} from "react";
import {toast} from "react-toastify";

import {AddCard, Checkbox, ColorTheme, FieldPaneRow, InputField, SelectableList, SelectField, useListSelection} from "#UI/index.js";
import {up_emulator} from "#client_core/index.js";
import {error_text} from "#client_core/proxy/errors.js";
import TypeOptionsContainer from "../Sidebar/NodesSidebar/EndpointProperties/TypeOptionsContainer.jsx";
import type {io_block, io_port, SimpleStringOption} from "#interfaces/index.js";

interface IoBlockEndpointsProps {
    block: io_block,
    emulator: up_emulator,
    bump_version: () => void,
}

const TYPES: SimpleStringOption[] = [{label: "float", value: "float"}, {label: "integer", value: "integer"}];

/// The fields of one endpoint of an IO block
const EndpointFields = (props: IoBlockEndpointsProps & {port: io_port}) =>{
    const {block, port, emulator} = props;

    const edit = async <K extends keyof io_port>(field: K, value: io_port[K]) =>{
        try{
            await emulator.edit_io_port(block.id, port.name, field, value);
            props.bump_version();
        } catch (err) {
            toast.error(error_text(err));
        }
    };

    const handle_number = async (event: React.KeyboardEvent<HTMLInputElement>) =>{
        if(event.key !== "Enter" && event.key !== "Tab") return;
        const number = parseInt(event.currentTarget.value);
        if(Number.isNaN(number) || number < 0) return;
        await edit(event.currentTarget.name as "address" | "width", number);
    };

    return(
        <FieldPaneRow key={block.id + "." + port.name}>
            <TypeOptionsContainer label="Endpoint">
                <InputField id="address" name="address" label="Bus address" defaultValue={port.address.toString()} onKeyDown={handle_number}/>
                <SelectField<SimpleStringOption>
                    stacked
                    label="Data type on the bus"
                    onChange={(selection) => {if(selection !== null) edit("type", selection.value);}}
                    value={{label: port.type, value: port.type}}
                    name="type"
                    options={TYPES}/>
                {port.type === "integer" && <>
                    <InputField id="width" name="width" label="Width (bits)" defaultValue={port.width.toString()} onKeyDown={handle_number}/>
                    <Checkbox name="signed" value={port.signed} onChange={(event) => edit("signed", event.target.checked)} label="Signed"/>
                </>}
            </TypeOptionsContainer>
        </FieldPaneRow>
    );
};

/// The endpoints of an IO block, a source or a sink, as the inputs, outputs and memory of a core are: the list of them,
/// and the properties of the selected one beside it
export const IoBlockEndpoints = (props: IoBlockEndpointsProps) =>{
    const {block, emulator} = props;

    const [selected, set_selected] = useState<string | undefined>(undefined);
    // the selection of many, that is another one for another block
    const [multi_count, set_multi_count] = useState(0);
    const selection = useListSelection(block.id, (names) => set_multi_count(names.length));

    const names = block.ports.map((port) => port.name);
    const port = block.ports.find((p) => p.name === selected) ?? undefined;

    const run = async (change: Promise<unknown>) =>{
        try{
            await change;
            props.bump_version();
        } catch (err) {
            toast.error(error_text(err));
        }
    };

    let handle_select = (name: string) =>{
        selection.clear();
        set_selected(name);
    };

    let handle_rename = async (name: string, new_name: string) =>{
        await run(emulator.edit_io_port(block.id, name, "name", new_name));
        if(selected === name) set_selected(new_name);
    };

    let handle_remove = async (name: string) =>{
        await run(emulator.remove_io_port(block.id, name));
        if(selected === name) set_selected(undefined);
    };

    let remove_many = async (removed: string[]) =>{
        for(const name of removed) await run(emulator.remove_io_port(block.id, name));
        set_selected(undefined);
    };

    return(
        <div style={{display: "flex", flexDirection: "row", height: "100%"}}>
            <div style={{flex: "0 0 14em", overflowY: "auto", overflowX: "hidden", background: ColorTheme.background.level_3}}>
                <div style={{maxHeight: "13em"}}>
                    <AddCard label="Add endpoint" onClick={() => run(emulator.add_io_port(block.id))}/>
                    <SelectableList
                        style={{width: "auto"}}
                        items={names}
                        selected_item={selected}
                        onSelect={handle_select}
                        {...(selection.many ? {selection: selection.many} : {})}
                        onSelectionChange={(changed) => selection.change(changed, handle_select)}
                        onRemoveMany={remove_many}
                        onRemove={handle_remove}
                        onRename={handle_rename}
                    />
                </div>
            </div>
            <div style={{flex: 1, minWidth: 0, overflow: "auto"}}>
                {multi_count > 1
                    ? <div style={{padding: "1em", textAlign: "center", fontStyle: "italic", color: "var(--text-secondary)"}}>
                        {multi_count} items selected. Right click one of them for what can be done to all of them.
                    </div>
                    : port !== undefined
                        ? <EndpointFields {...props} port={port}/>
                        : <div style={{height: "100%", display: "flex", alignItems: "center", justifyContent: "center", padding: "1em", textAlign: "center", fontStyle: "italic", color: "var(--text-secondary)"}}>
                            Select an item to edit it
                        </div>
                }
            </div>
        </div>
    );
};
