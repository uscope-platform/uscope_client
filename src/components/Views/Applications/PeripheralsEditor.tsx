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

import React, {useState} from 'react';
import {MdAdd} from "react-icons/md";
import {styled} from "goober";

import {ColorTheme, InputField, SelectableList} from "#UI/index.js";
import {PeripheralProperties} from "#components/Views/Applications/Properties/index.js";
import type {up_application, up_peripheral} from "#client_core/index.js";

// two rows, so that the editor starts level with the first card of the list and not with its header
const Layout = styled('div')`
  display: grid;
  grid-template-columns: 16rem minmax(0, 1fr);
  grid-template-rows: auto auto;
  gap: 0.5rem 1rem;
  align-items: start;
`

const ListHeader = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 0;
`

const SearchRow = styled('div')`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const Count = styled('div')`
  font-size: 0.8rem;
  color: ${ColorTheme.inactive_icons_color};
`

interface PeripheralsEditorProps {
    application: up_application;
    peripherals: Record<number, up_peripheral>;
    forceUpdate: () => void;
    onAdd: () => void;
}

/// The peripherals of an application: a searchable list, and the editor of the selected one next to it. An
/// application can have dozens of them, which made a stack of cards unusable
export let PeripheralsEditor = (props: PeripheralsEditorProps) =>{

    const [selected_name, set_selected_name] = useState<string | null>(null);
    const [filter, set_filter] = useState("");

    const instances = props.application.peripherals;
    const ip_name = (spec_id: string) => props.peripherals[parseInt(spec_id)]?.name;
    const description = (p: typeof instances[number]) => [ip_name(p.spec_id), p.base_address].filter(Boolean).join(" · ");

    const needle = filter.trim().toLowerCase();
    const visible = instances.filter((p) => needle === "" || (p.name + " " + description(p)).toLowerCase().includes(needle));

    // the one selected, or the first one when it is gone (removed, or the application changed)
    const selected = instances.find(p => p.name === selected_name) ?? visible[0];

    let handleRemove = async (name: string) =>{
        const peripheral = instances.find(p => p.name === name);
        if(peripheral === undefined) return;
        await props.application.remove_peripheral(peripheral.peripheral_id);
        props.forceUpdate();
    }

    return(
        <Layout>
            <ListHeader>
                <SearchRow>
                    <MdAdd onClick={props.onAdd} size={ColorTheme.icons_size} color={ColorTheme.icons_color}/>
                    <div style={{flexGrow: 1}}>
                        <InputField compact name="peripheral_filter" label="Search" onChange={(e) => set_filter(e.target.value)}/>
                    </div>
                </SearchRow>
                <Count>{visible.length === instances.length ? instances.length + " peripherals" : visible.length + " of " + instances.length}</Count>
            </ListHeader>
            <div/>
            <SelectableList
                variant="card"
                items={visible.map(p => p.name)}
                descriptions={visible.map(description)}
                selected_item={selected?.name}
                onSelect={set_selected_name}
                onRemove={handleRemove}
                style={{maxHeight: "calc(100vh - 16rem)", margin: 0, width: "auto"}}
            />
            {selected !== undefined
                ? <PeripheralProperties
                    key={selected.name}
                    application={props.application}
                    peripherals={props.peripherals}
                    forceUpdate={props.forceUpdate}
                    peripheral={selected}
                />
                : <div/>
            }
        </Layout>
    );
};
