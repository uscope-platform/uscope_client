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

import React from 'react';

import CoreInputProperties from "./CoreInputProperties";
import CoreOutputProperties from "./CoreOutputProperties";
import CoreMemoryProperties from "./CoreMemoryProperties";

let  NodeIomProperties = props =>{

    if(!props.selected_iom) return ;

    if(props.selected_iom.type === "inputs"){
       return <CoreInputProperties
           selected_core={props.selected_core}
           selected_emulator={props.selected_emulator}
           selected_component={props.selected_component}
           selected_iom={props.selected_iom}
           on_modify={props.on_iom_modify}
       />
    } else if(props.selected_iom.type === "outputs") {
       return <CoreOutputProperties
           selected_core={props.selected_core}
           selected_emulator={props.selected_emulator}
           selected_component={props.selected_component}
           selected_iom={props.selected_iom}
           on_modify={props.on_iom_modify}
       />
    } else if(props.selected_iom.type === "memory_init") {
        return <CoreMemoryProperties
            selected_core={props.selected_core}
            selected_emulator={props.selected_emulator}
            selected_component={props.selected_component}
            selected_iom={props.selected_iom}
            on_modify={props.on_iom_modify}
        />
    }

};

export default NodeIomProperties;
