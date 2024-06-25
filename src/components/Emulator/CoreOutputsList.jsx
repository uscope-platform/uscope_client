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

import React, {useReducer} from 'react';
import IomProperties from "./IomProperties";

let  CoreOutputsList = props =>{

    let selected_core_id = props.selected_component ? props.selected_component.obj.id : null;

    const [, forceUpdate] = useReducer(x => x + 1, 0);


    let handle_add = (output_size) =>{
        props.emulator.add_output(selected_core_id, output_size).then(()=>{
            forceUpdate();
        });
    }

    let handle_remove = (removed_item) =>{
        forceUpdate();
        props.emulator.remove_output(selected_core_id, removed_item).then(()=>{
            forceUpdate();
        });
    }

    return(
        <IomProperties
            emulator={props.emulator}
            onRemove={handle_remove}
            onAdd={handle_add}
            selected_iom={props.selected_iom}
            selected_component={props.selected_component}
            on_select={props.on_iom_select}
            content_type="outputs"
        />
    );
};

export default CoreOutputsList;
