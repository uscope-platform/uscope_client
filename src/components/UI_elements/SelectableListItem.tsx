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
import React, {type ReactNode} from "react";
import {Image} from "./Image.js";
import {ColorTheme} from "./ColorTheme.js";
import {DeleteButton} from "#UI/DeleteButton.js";

interface ItemLayoutProps {
    selected: boolean;
    variant: 'card' | 'plain';
}


const ItemLayout = styled<'div', ItemLayoutProps>('div')(({ selected, variant }) => variant === 'card' ? `
  display: flex;
  align-items: center;
  gap: 0.5em;
  padding: 0.25em 0.75em;
  border-radius: 0.5rem;
  border: 1px solid ${selected ? ColorTheme.background.accents : ColorTheme.background.borders};
  border-left-width: 4px;
  background: ${selected ? ColorTheme.background.level_4 : ColorTheme.background.level_3};
  transition: background 0.15s, border-color 0.15s;
  &:hover {
    background: ${ColorTheme.background.level_4};
  }
` : `
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
    onSelect?: ((name: string, multi?: boolean) => void )| undefined;
    onMouseEnter?: (name: string) => void;
    onActivate?: ((name: string) => void) | undefined;
    description?: string | undefined;
    card?: boolean | undefined;
    iconSize?: number | string;
}

export let  SelectableListItem = (props: SelectableListItemProps) =>{
    const image_src = "assets/selector_icons/" + props.icon+".svg";
    const alt = props.icon + "language icon";


    let handle_click = (event: any) =>{
        if(props.multi_select && props.onSelect){
            if(event.ctrlKey) props.onSelect(props.name, true);
            else props.onSelect(props.name, false);
        } else{
            if(props.onSelect) props.onSelect(props.name)
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
            return(<DeleteButton onRemove={props.onRemove} name={props.name}/>);
        }
    }

    let handle_double_click = () =>{
        if(props.onActivate) props.onActivate(props.name);
    }

    let handleMouseEnter = () =>{
        if(props.onMouseEnter)
            props.onMouseEnter(props.name);
    }

    return(
        <ItemLayout selected={props.selected} variant={props.card ? "card" : "plain"}>
            <div></div>
            <div onMouseEnter={handleMouseEnter} onClick={handle_click} onDoubleClick={handle_double_click} style={{display:"flex", flexGrow:1}}>
                {get_icon_image(props.icon)}
                <div style={{marginLeft:"0.5em", cursor:"default"}}>
                    <p style={{paddingTop:"6px"}}>{props.name}</p>
                    {props.description && <p style={{fontSize:"0.8em", opacity:0.6, paddingBottom:"6px"}}>{props.description}</p>}
                </div>
            </div>
            {render_delete()}
        </ItemLayout>
    );
};

