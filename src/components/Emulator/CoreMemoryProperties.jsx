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
import {useSelector} from "react-redux";
import {up_emulator} from "../../client_core";
import IomProperties from "./IomProperties";


let  CoreMemoryProperties = props =>{


    const emulators_store = useSelector(state => state.emulators);
    const settings = useSelector(state => state.settings);

    let selected_core_id = settings.emulator_selected_component ? settings.emulator_selected_component.obj.id : null;

    let selected_emulator = new up_emulator(emulators_store[parseInt(settings.selected_emulator)]);

    const [, forceUpdate] = useReducer(x => x + 1, 0);

    let handle_add = (memory_size) =>{
        selected_emulator.add_memory(selected_core_id, memory_size).then(()=>{
            forceUpdate();
        });
    }

    let handle_remove = (removed_item) =>{
        selected_emulator.remove_memory(selected_core_id, removed_item).then(()=>{
            forceUpdate();
        });
    }

    return(
        <IomProperties
            onRemove={handle_remove}
            onAdd={handle_add}
            content_type="memory_init"
        />
    );
};

export default CoreMemoryProperties;
