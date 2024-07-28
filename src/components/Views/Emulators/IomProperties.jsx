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
import {SelectableList} from "../../UI_elements";

let  IomProperties = props =>{

    let [selected, set_selected] = useState(null);

    const sel_component_type = props.selected_component ? props.selected_component.type : null;

    let outputs_list = [];

    if(sel_component_type && sel_component_type === "node"){
        outputs_list = Object.values(props.emulator.cores).filter((item)=>{
            return item.id === props.selected_component.obj.id;
        })[0][props.content_type].map((item)=>{
            return item.name;
        });
    }

    useEffect(() => {
        if(props.selected_iom){
            if(props.selected_iom.type !== props.content_type){
                set_selected(null);
            }
        }

    }, [props.selected_iom]);

    let handle_add = () =>{
      props.onAdd(outputs_list.length);
    }

    let handle_remove = (removed_item) =>{
        props.onRemove(removed_item);
    }

    let handle_select = (args) =>{
        props.on_select({type:props.content_type, obj:args});
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
            <SelectableList items={outputs_list} selected_item={selected} onSelect={handle_select} onRemove={handle_remove} />
        </div>
    );
};

export default IomProperties;
