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
import {toast} from "react-toastify";

import {download_bitstream, get_next_id, up_rpu_program, upload_raw} from "#client_core/index.js";
import {error_text} from "#client_core/proxy/errors.js";
import {AddCard, SelectableList, SidebarColumn, useListSelection} from "#UI/index.js";
import {useAppSelector} from "#redux/hooks.js";
import type {rpu_program_model} from "#interfaces/index.js";
import {program_description} from "./rpu_info.js";

interface RpuSidebarProps {
    on_select: (id: number) => void;
    // the id of the program that is shown
    selected: number;
}

let RpuSidebar = (props: RpuSidebarProps) =>{

    const programs_store = useAppSelector(state => state.rpu);
    const selection = useListSelection("rpu_programs");

    const programs = Object.values(programs_store);
    const named = (name: string) => programs.find((prog) => prog.name === name);

    let handleSelect = (name: string) => {
        selection.clear();
        const prog = named(name);
        if(prog !== undefined) props.on_select(prog.id);
    };

    let handleAdd = async () =>{
        try{
            let event = await upload_raw();
            let file = await up_rpu_program.get_file_content(event);
            const id = get_next_id(programs.map(a => a.id));
            // the list tells the programs apart by their name, so it has to be the only one with it
            const name = named(file.name) === undefined ? file.name : file.name + "_" + id;
            await new up_rpu_program({id: id, name: name, data: file.content, core: 0}).add_remote();
            props.on_select(id);
        } catch (err) {
            toast.error(error_text(err));
        }
    };

    let handleRename = async (name: string, new_name: string) =>{
        const prog = named(name);
        if(prog === undefined) return;
        if(named(new_name) !== undefined){
            toast.error("There is a program called " + new_name + " already");
            return;
        }
        try{
            await new up_rpu_program(prog).edit_field("name", new_name);
        } catch (err) {
            toast.error(error_text(err));
        }
    };

    let removeProgram = async (prog: rpu_program_model) =>{
        try{
            await up_rpu_program.delete_program(new up_rpu_program(prog));
        } catch (err) {
            toast.error(error_text(err));
        }
    };

    let handleRemove = async (name: string) =>{
        const prog = named(name);
        if(prog !== undefined) await removeProgram(prog);
    };

    let handleRemoveMany = async (names: string[]) =>{
        for(const name of names){
            const prog = named(name);
            if(prog !== undefined) await removeProgram(prog);
        }
    };

    let exportProgram = async (prog: rpu_program_model) =>{
        try{
            const file = await new up_rpu_program(prog).export_program();
            download_bitstream(file.data, file.name);
        } catch (err) {
            toast.error(error_text(err));
        }
    };

    const names = programs.map((prog) => prog.name);
    const selected_prog = programs_store[props.selected];

    return(
        <SidebarColumn panels={[{title: "RPU Program List", content: (
            <div style={{display: "flex", flexDirection: "column"}}>
                <AddCard label="Add RPU Program" onClick={handleAdd}/>
                <SelectableList
                    variant="card"
                    items={names}
                    descriptions={programs.map(program_description)}
                    selected_item={selected_prog?.name}
                    {...(selection.many ? {selection: selection.many} : {})}
                    onSelectionChange={(selected_names) => selection.change(selected_names, handleSelect)}
                    onSelect={handleSelect}
                    onRename={handleRename}
                    onRemove={handleRemove}
                    onRemoveMany={handleRemoveMany}
                    item_actions={(name) => {
                        const prog = named(name);
                        return prog === undefined ? [] : [{label: "Export", onSelect: () => exportProgram(prog)}];
                    }}
                    bulk_actions={(selected_names) => [{
                        label: "Export " + selected_names.length + " items",
                        onSelect: () => selected_names.forEach((name) => {
                            const prog = named(name);
                            if(prog !== undefined) exportProgram(prog);
                        })
                    }]}
                    style={{maxHeight: "none"}}
                />
            </div>
        )}]}/>
    );
};

export default RpuSidebar;
