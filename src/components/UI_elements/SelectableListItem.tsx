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

import {styled} from 'goober';
import React, {type ReactNode, useState} from "react";
import {Image} from "./Image.js";
import {MdDelete} from "react-icons/md";
import {ColorTheme} from "./ColorTheme.js";

interface ItemLayoutProps {
    selected: boolean;
}


const ItemLayout = styled<'div', ItemLayoutProps>('div')(({ selected }) => `
  display: flex;
  align-items: center;
  gap: 0.5em;
  background: ${selected ? ColorTheme.background.transparent_accents : '#0000'};
`);

interface SelectableListItemProps {
    icon:string| ReactNode;
    selected: boolean;
    multi_select?: boolean | undefined;
    name: string;
    onRemove?: ((name: string) => void )| undefined;
    onSelect: (name: string, multi?: boolean) => void;
    onMouseEnter?: (name: string) => void;
    iconSize?: number;
}

export let  SelectableListItem = (props: SelectableListItemProps) =>{
    const image_src = "assets/selector_icons/" + props.icon+".svg";
    const alt = props.icon + "language icon";

    let [color, set_color] = useState("white");
    let [confirm_needed, set_confirm_needed] = useState(false);

    let handle_click = (event: any) =>{
        if(props.multi_select){
            if(event.ctrlKey) props.onSelect(props.name, true);
            else props.onSelect(props.name, false);
        } else{
            props.onSelect(props.name)
        }

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
            if(props.onRemove) props.onRemove(props.name);
        }
    };


    let get_icon_image = (icon: string | ReactNode) =>{
        if(props.icon){
            if(typeof icon === "string"){
                return <Image style={{width:"2em"}} src={image_src} alt={alt}/>
            } else {
                return icon;
            }
        }
    }

    let render_delete = () =>{
        if(props.onRemove){
            return(<MdDelete size={props.iconSize?props.iconSize:ColorTheme.icons_size} onClick={handle_remove} color={color}/>);
        }
    }

    let handleMouseEnter = () =>{
        if(props.onMouseEnter)
            props.onMouseEnter(props.name);
    }

    return(
        <ItemLayout selected={props.selected}>
            <div></div>
            <div onMouseEnter={handleMouseEnter} onClick={handle_click} style={{display:"flex", flexGrow:1}}>
                {get_icon_image(props.icon)}
                <p style={{marginLeft:"0.5em", paddingTop:"6px", cursor:"default"}}>{props.name}</p>
            </div>
            {render_delete()}
        </ItemLayout>
    );
};

