// Copyright 2021 Filippo Savi
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

import React from "react";
import {SelectableListLayout} from "./SelectableListLayout";
import {SelectableListItem} from './SelectableListItem';


export let  SelectableList = props =>{

    let constructListContent = (names, icons) =>{
        let ret = []
        for(let i = 0; i< names.length; i++){
            ret.push(<SelectableListItem key={names[i]}  onRemove={props.onRemove} onSelect={props.onSelect} selected={props.selected_item===names[i]} icon={icons ? icons[i]: undefined} name={names[i]}/>)
        }
        return ret;
    }

    return(
        <SelectableListLayout>
            {constructListContent(props.items, props.types)}
        </SelectableListLayout>
    );
};

