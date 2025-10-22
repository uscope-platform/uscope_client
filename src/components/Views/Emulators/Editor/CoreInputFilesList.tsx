// Copyright 2023 Filippo Savi
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

import React, {useReducer, useState} from 'react';
import {MdAdd} from "react-icons/md";
import {SelectableList} from "#UI/index.js";
import {up_emulator, upload_json} from "#client_core/index.js";
import type {EmulatorSelections} from "#interfaces/index.js";
import {toast} from "react-toastify";

interface CoreInputFilesListProps {
    emulator: up_emulator,
    selections: EmulatorSelections
}

let  CoreInputFilesList = (props: CoreInputFilesListProps) =>{
    let [selected, set_selected] = useState("");

    let component = props.selections.component;
    const sel_component_type = component ? component.type : null;
    const [, forceUpdate] = useReducer(x => x + 1, 0);

    let files_list = [];

    if(sel_component_type && sel_component_type === "node" && component){
        let core = Object.values(props.emulator.cores).filter((item)=>{
            return item.id === component.obj.id;
        })[0];
        if(core === undefined) return;
        files_list = core.input_data.map((item)=>{
            return item.name;
        });
    } else{
        return;
    }

    let selected_core = component.obj.id;

    let handle_add = async () =>{
        try{
            let file = await upload_json();
            let lines = file.data.split("\n");
            if(lines[0] === undefined) return;
            let columns = lines[0].split(",");
            let data_obj: Record<string, number[]> = {};
            for(let c_n of columns){
                data_obj[c_n] = [];
            }
            lines.shift();
            for(let l of lines){
                if(l !== ""){
                    let tokens = l.split(",");
                    for(let i = 0; i< tokens.length; i++){
                        let col = columns[i];
                        let tok = tokens[i];
                        if(col === undefined|| tok === undefined || data_obj[col] === undefined) {
                            console.error("ERROR: Malformed data file");
                            toast.error("ERROR: Malformed data file");
                            return;
                        }
                        data_obj[col].push(parseFloat(tok));
                    }
                }
            }
            let f_n = file.name.replace(".csv","")
            props.emulator.add_input_file(selected_core, f_n, data_obj).then(()=>{
                forceUpdate();
            })
        } catch (err){
            alert(err);
        }

    }

    let handle_remove = (removed_item: string) =>{
        props.emulator.remove_input_file(selected_core, removed_item).then(()=>{
            forceUpdate();
        });
    }

    let handle_select = (args: string) =>{
        set_selected(args)
    }
    return(
        <div  style={{maxHeight: "13em", overflow:"auto" }} >
            <div style={{
                display:"flex",
                flexDirection:"row",
                marginTop:"0.25em"
            }}>
                <MdAdd style={{marginLeft:"auto"}} onClick={handle_add}/>
            </div>
            <SelectableList items={files_list} selected_item={selected} onSelect={handle_select} onRemove={handle_remove} />
        </div>
    );
};

export default CoreInputFilesList;
