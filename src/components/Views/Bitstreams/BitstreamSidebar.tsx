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


import React from 'react';
import {toast} from "react-toastify";

import {download_bitstream, get_next_id, up_application, up_bitstream, upload_raw} from "#client_core/index.js";
import {error_text} from "#client_core/proxy/errors.js";
import {AddCard, SelectableList, SidebarColumn, useListSelection} from "#UI/index.js";
import {useAppSelector} from "#redux/hooks.js";
import type {bitstream_model} from "#interfaces/index.js";
import {applications_using, short_hash} from "./bitstream_info.js";

interface BitstreamSidebarProps {
    on_select: (id: number) => void;
    // the id of the bitstream that is shown
    selected: number;
}

let  BitstreamSidebar = (props: BitstreamSidebarProps) =>{

    const bitstreams_store = useAppSelector(state => state.bitstreams);
    const applications = useAppSelector(state => state.applications);
    const selection = useListSelection("bitstreams");

    const bitstreams = Object.values(bitstreams_store);
    const named = (name: string) => bitstreams.find((bit) => bit.name === name);

    let handleSelect = (name: string) => {
        selection.clear();
        const bit = named(name);
        if(bit !== undefined) props.on_select(bit.id);
    };

    let handleAdd = async () =>{
        try{
            let event = await upload_raw();
            let file = await up_bitstream.get_file_content(event);
            const id = get_next_id(bitstreams.map(a => a.id));
            // the applications refer to a bitstream by its name, so it has to be the only one with it
            const name = named(file.name) === undefined ? file.name : file.name + "_" + id;
            await new up_bitstream({id: id, name: name, data: file.content}).add_remote();
            props.on_select(id);
        } catch (err) {
            toast.error(error_text(err));
        }
    };

    // the applications that loaded it by its name keep loading it
    let handleRename = async (name: string, new_name: string) =>{
        const bit = named(name);
        if(bit === undefined) return;
        try{
            await new up_bitstream(bit).edit_field("name", new_name);
            for(const application of applications_using(name, applications)){
                await new up_application(application).edit_bitstream(new_name);
            }
        } catch (err) {
            toast.error(error_text(err));
        }
    };

    let removeBitstream = async (bit: bitstream_model) =>{
        await up_bitstream.delete_bitstream(new up_bitstream(bit));
    };

    let handleRemove = async (name: string) =>{
        const bit = named(name);
        if(bit === undefined) return;
        const users = applications_using(name, applications);
        if(users.length > 0) toast.warn(users.map((a) => a.application_name).join(", ") + (users.length > 1 ? " load" : " loads") + " this bitstream, and will not find it");
        await removeBitstream(bit);
    };

    let handleRemoveMany = async (names: string[]) =>{
        for(const name of names){
            const bit = named(name);
            if(bit !== undefined) await removeBitstream(bit);
        }
    };

    let exportBitstream = async (bit: bitstream_model) =>{
        try{
            const file = await new up_bitstream(bit).export_bitstream();
            download_bitstream(file.data, file.name);
        } catch (err) {
            toast.error(error_text(err));
        }
    };

    const names = bitstreams.map((bit) => bit.name);
    const selected_bit = bitstreams_store[props.selected];

    return(
        <SidebarColumn panels={[{title: "Bitstream List", content: (
            <div style={{display: "flex", flexDirection: "column"}}>
                <AddCard label="Add Bitstream" onClick={handleAdd}/>
                <SelectableList
                    variant="card"
                    items={names}
                    descriptions={bitstreams.map(short_hash)}
                    selected_item={selected_bit?.name}
                    {...(selection.many ? {selection: selection.many} : {})}
                    onSelectionChange={(selected_names) => selection.change(selected_names, handleSelect)}
                    onSelect={handleSelect}
                    onRename={handleRename}
                    onRemove={handleRemove}
                    onRemoveMany={handleRemoveMany}
                    item_actions={(name) => {
                        const bit = named(name);
                        return bit === undefined ? [] : [{label: "Export", onSelect: () => exportBitstream(bit)}];
                    }}
                    bulk_actions={(selected_names) => [{
                        label: "Export " + selected_names.length + " items",
                        onSelect: () => selected_names.forEach((name) => {
                            const bit = named(name);
                            if(bit !== undefined) exportBitstream(bit);
                        })
                    }]}
                    style={{maxHeight: "none"}}
                />
            </div>
        )}]}/>
    );
};

export default BitstreamSidebar;
