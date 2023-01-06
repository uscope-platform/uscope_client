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

import styled from 'styled-components';
import React, {useState} from "react";
import {Image} from "./Image";
import {MdDelete} from "react-icons/md";
import {ColorTheme} from "./ColorTheme";



const ItemLayout = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5em;
    background: ${props => props.selected ?props.theme.background.accents+"90":"#0000"}
`
export let  SelectableListItem = props =>{
    const image_src = "assets/selector_icons/" + props.icon+".svg";
    let selected = {selected:props.selected};
    const alt = props.icon + "language icon";

    let [color, set_color] = useState("white");
    let [confirm_needed, set_confirm_needed] = useState(false);

    let handle_click = () =>{
        props.onSelect(props.name)
    };

    let handle_remove = () =>{
        set_color("red");
        if(!confirm_needed){
            set_confirm_needed(true);
            setTimeout(() => {
                set_confirm_needed(false);
                set_color("white");
            }, 1500);
        } else{
            props.onRemove(props.name);
        }
    };


    let get_icon_image = (icon) =>{
        if(typeof icon === "string"){
            return <Image style={{width:"2em"}} src={image_src} alt={alt}/>
        } else {
            return icon;
        }
    }



    return(
        <ItemLayout {...selected}>
            <div></div>
            <div onClick={handle_click} style={{display:"flex", flexGrow:1}}>
                {get_icon_image(props.icon)}
                <p style={{marginLeft:"0.5em", paddingTop:"6px", cursor:"default"}}>{props.name}</p>
            </div>
            <MdDelete size={ColorTheme.icons_size} onClick={handle_remove} color={ColorTheme.icons_color}/>



        </ItemLayout>
    );
};

