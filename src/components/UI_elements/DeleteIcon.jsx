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

import React, {useState} from "react";
import {ColorTheme} from "./ColorTheme";
import {MdDelete} from "react-icons/md";




export let  DeleteIcon = props =>{

    let [color, set_color] = useState("white");
    let [confirm_needed, set_confirm_needed] = useState(false);

    let handle_remove = () =>{
        set_color("red");
        if(!confirm_needed){
            set_confirm_needed(true);
            setTimeout(() => {
                set_confirm_needed(false);
                set_color("white");
            }, 1500);
        } else{
            props.onRemove();
        }
    };

    return(
        <MdDelete style={{marginLeft:"auto"}} size={ColorTheme.icons_size} onClick={handle_remove} color={color}/>
    );
};