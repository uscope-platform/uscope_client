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


export let  ChipSelector = props =>{


    let [checked, set_checked] = useState(props.value);

    let handle_click = () =>{
        let new_state = !checked;
        set_checked(new_state);
        props.onClick({name:props.name, checked:new_state});
    };

    let color = checked?ColorTheme.background.accents:ColorTheme.background.level_3;
    return(
        <div style={{
            marginLeft:"auto",
            paddingLeft:"0.3em",
            paddingRight:"0.3em",
            alignContent:"baseline",
            borderStyle:"solid",
            borderColor:color,
            backgroundColor:color,
            borderRadius:"30px"}
        } onClick={handle_click}
        >
            <p style={{cursor:"default"}}>{props.label}</p>
        </div>
    );
};