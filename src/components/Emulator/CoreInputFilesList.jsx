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
import {SelectableList} from "../UI_elements";
import {useSelector} from "react-redux";
import {up_emulator, upload_json} from "../../client_core";

let  CoreInputFilesList = props =>{
    let [selected, set_selected] = useState(null);

    const sel_component_type = props.selected_component ? props.selected_component.type : null;
    const [, forceUpdate] = useReducer(x => x + 1, 0);

    let files_list = [];

    if(sel_component_type && sel_component_type === "node"){
        files_list = Object.values(props.emulator.cores).filter((item)=>{
            return item.id === props.selected_component.obj.id;
        })[0].input_data.map((item)=>{
            return item.name;
        });
    } else{
        return;
    }

    let selected_core = props.selected_component.obj.id;

    let handle_add = () =>{
        upload_json().then((result)=>{
            let lines = result.data.split("\n");
            let columns = lines[0].split(",");
            let data_obj = {};
            for(let c_n of columns){
                data_obj[c_n] = [];
            }
            lines.shift();
            for(let l of lines){
                let tokens = l.split(",");
                for(let i = 0; i< tokens.length; i++){
                   data_obj[columns[i]].push(parseFloat(tokens[i]));
                }
            }
            let f_n = result.name.replace(".csv","")
            props.emulator.add_input_file(selected_core, f_n, data_obj).then(()=>{
                forceUpdate();
            })
        }).catch((err)=>{
            alert(err);
        })

    }

    let handle_remove = (removed_item) =>{
        props.emulator.remove_input_file(selected_core, removed_item).then(()=>{
            forceUpdate();
        });
    }

    let handle_select = (args) =>{
        set_selected(args)
    }
    return(
        <div>
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
