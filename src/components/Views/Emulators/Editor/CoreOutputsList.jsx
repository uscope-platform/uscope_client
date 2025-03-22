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

import React, {useEffect, useState} from 'react';
import {MdAdd} from "react-icons/md";
import {SelectableList} from "@UI";

let  CoreOutputsList = props =>{

    let selected_core_id = props.selections.component ? props.selections.component.obj.id : null;

    let [selected, set_selected] = useState(null);

    let [outputs, set_outputs] = useState([]);

    useEffect(() => {
        if(props.selections.component && props.selections.component.type === "node"){
            set_outputs(props.emulator.get_output_names(selected_core_id));
        } else set_outputs([]);
    }, [props.selections.component, props.selections.obj_version]);

    useEffect(() => {
        if(props.selections.iom){
            if(props.selections.iom.type !== "outputs"){
                set_selected(null);
            } else{
                set_selected(props.selections.iom.obj);
            }
        }

    }, [props.selections.iom]);


    let handle_add = () =>{
        props.emulator.add_output(selected_core_id, outputs.length).then(()=>{
            set_outputs(props.emulator.get_output_names(selected_core_id));
        });
    }

    let handle_remove = (removed_item) =>{
        props.emulator.remove_output(selected_core_id, removed_item).then(()=>{
            set_outputs(props.emulator.get_output_names(selected_core_id));
        });
    }

    let handle_select = (args) =>{
        props.on_selection({type:"outputs", obj:args});
        set_selected(args)
    }

    return (
        <div>
            <div style={{
                display: "flex",
                flexDirection: "row",
                marginTop: "0.25em"
            }}>
                <MdAdd style={{marginLeft: "auto"}} onClick={handle_add}/>
            </div>
            <SelectableList items={outputs} selected_item={selected} onSelect={handle_select}
                            onRemove={handle_remove}/>
        </div>
    );
};

export default CoreOutputsList;
