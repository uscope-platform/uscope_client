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

import React, {useEffect, useState} from "react";
import {MdDelete} from "react-icons/md";
import {ColorTheme} from "./ColorTheme.js";



interface DeleteButtonBase{
    iconSize?: number | string;
    enable?: boolean;
}

interface NamedDeleteButton extends DeleteButtonBase{
    onRemove?: ((name: string) => void )| undefined;
    name: string;
}

interface UnnamedDeleteButton extends DeleteButtonBase{
    onRemove?: (() => void )| undefined;
    name?: undefined;
}

export let  DeleteButton = (props: NamedDeleteButton | UnnamedDeleteButton) =>{

    useEffect(() => {
        if(props.enable !== undefined && !props.enable){
            set_color(ColorTheme.disabled_icon_color);
            set_confirm_needed(false);
        } else if(props.enable){
            set_color("white");
            set_confirm_needed(false);
        }
    }, [props.enable]);

    let [color, set_color] = useState("white");
    let [confirm_needed, set_confirm_needed] = useState(false);


    let handle_remove = () =>{
        if(props.enable !== undefined && !props.enable) return;
        set_color("red");
        if(!confirm_needed){
            set_confirm_needed(true);
            setTimeout(() => {
                set_confirm_needed(false);
                set_color("white");
            }, 1500);
        } else{
            if(props.onRemove){
                if (props.name !== undefined) {
                    props.onRemove(props.name);
                } else {
                    props.onRemove();
                }
            }
        }
    };


    return(
        <MdDelete size={props.iconSize?props.iconSize:ColorTheme.icons_size} onClick={handle_remove} color={color}/>
    );
};

