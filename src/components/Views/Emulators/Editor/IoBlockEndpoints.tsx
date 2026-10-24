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

import {MdScience} from "react-icons/md";
import {AddCard, Checkbox, ColorTheme, FieldPaneRow, FieldSpan, InputField, SelectableList, SelectField, useListSelection} from "#UI/index.js";
import {up_emulator} from "#client_core/index.js";
import {error_text} from "#client_core/proxy/errors.js";
import TypeOptionsContainer from "../Sidebar/NodesSidebar/EndpointProperties/TypeOptionsContainer.jsx";
import {ConstantInputProperties, ExternalInputProperties, SeriesInputProperties, WaveformInputProperties} from "../Sidebar/NodesSidebar/EndpointProperties/inputs/index.js";
import type {core_input_source, io_block, io_port, SimpleStringOption} from "#interfaces/index.js";

interface IoBlockEndpointsProps {
    block: io_block,
    emulator: up_emulator,
    bump_version: () => void,
}

const TYPES: SimpleStringOption[] = [{label: "float", value: "float"}, {label: "integer", value: "integer"}];

const SOURCE_TYPES: SimpleStringOption[] = [
    {label: "constant", value: "constant"},
    {label: "series", value: "series"},
    {label: "random", value: "random"},
    {label: "external", value: "external"},
    {label: "Waveform", value: "waveform"}
];

// the fields of a source that have a value for each channel: an endpoint carries one channel in each DMA slot, the first one
const PER_CHANNEL_FIELDS = ["von", "voff", "tdelay", "ton", "period", "dc_offset", "amplitude", "frequency", "phase", "duty", "value"];

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

    // where the data comes from in an emulation, for the endpoints of a source: the hardware gets it from the bus
    const source = port.source ?? up_emulator.default_io_source();

    const handle_source_type = (selection: SimpleStringOption | null) =>{
        if(selection !== null) edit("source", {...source, type: selection.value});
    };

    // the editors give the value of the channel: an endpoint has the one, the first
    const handle_source_change = (field: string, value: string | number | number[]) =>{
        if(PER_CHANNEL_FIELDS.includes(field)){
            const values = JSON.parse(JSON.stringify(source[field as keyof core_input_source] ?? []));
            values[0] = Array.isArray(value) ? value[0] : value;
            edit("source", {...source, [field]: values});
        } else {
            edit("source", {...source, [field]: value});
        }
    };

    const source_options = () =>{
        switch(source.type){
            case "constant":
                return <ConstantInputProperties key="source_constant" input={source} channel={0} onChange={handle_source_change}/>;
            case "series":
                return <SeriesInputProperties key="source_series" input={source} channel={0} onChange={handle_source_change}
                                              input_data={Object.values(emulator.cores).flatMap((core) => core.input_data)}/>;
            case "external":
                return <ExternalInputProperties key="source_external" input={source} channel={0} onChange={handle_source_change}/>;
            case "waveform":
                return <WaveformInputProperties key="source_waveform" input={source} channel={0} onChange={handle_source_change}/>;
            default:
                return null;
        }
    };

    return(
        <FieldPaneRow key={block.id + "." + port.name}>
            <TypeOptionsContainer label="On hardware">
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
            {block.direction === "source" && (
                <TypeOptionsContainer label="Source" emulation_only badge={{icon: <MdScience/>, text: "Emulation only"}}>
                    <FieldSpan>
                        <SelectField<SimpleStringOption>
                            stacked
                            label="Type"
                            onChange={handle_source_type}
                            value={{label: source.type, value: source.type}}
                            name="source_type"
                            options={SOURCE_TYPES}/>
                    </FieldSpan>
                    {source_options()}
                </TypeOptionsContainer>
            )}
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
