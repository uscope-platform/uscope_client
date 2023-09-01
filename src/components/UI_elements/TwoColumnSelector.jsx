// Copyright 2021 University of Nottingham Ningbo China
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
import {UIPanel} from "./panels/UIPanel";
import {SimpleContent} from "./panels/SimpleContent";
import {Responsive, WidthProvider} from "react-grid-layout";
import {MdArrowBack, MdArrowForward} from "react-icons/all";
import {SelectableList} from "./SelectableList";


export let  TwoColumnSelector = props =>{


    let [available_highlight, set_available_highlight] = useState("");
    let [selected_highlight, set_selected_highlight] = useState("");


    let handleSelect = () =>{
        let sel = Object.keys(props.data).filter((s)=>{
            return props.data[s][props.display_field] === available_highlight;
        })[0];
        props.onSelect(sel);
    }

    let handleDeSelect = () =>{
        let sel = Object.keys(props.data).filter((s)=>{
            return props.data[s][props.display_field] === selected_highlight;
        })[0];
      props.onDeselect(sel);
    }

    const ResponsiveGridLayout = WidthProvider(Responsive);

    return(
        <ResponsiveGridLayout
            className="layout"
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
            cols={{ lg: 24, md: 20, sm: 12, xs: 8, xxs: 4 }}
            useCSSTransforms={false}
        >
            <UIPanel key={"available_content_"+props.itemType} data-grid={{x: 0, y: 0, w: 11, h: 5}} level="level_3">
                <SimpleContent name={"Available " + props.itemType} content={
                    <SelectableList items={props.available_items} selected_item={available_highlight} onSelect={set_available_highlight} />
                }/>
            </UIPanel>
            <div key={props.itemType+"_selector_controls"}  data-grid={{x: 11, y: 0, w: 2, h: 5}} style={{
                display:"flex",
                flexDirection:"column",
                justifyContent:"center",
                alignItems:"center"
            }} >
                <MdArrowForward size={40} onClick={handleSelect}/>
                <MdArrowBack size={40} style={{
                    marginTop:"1em"
                }} onClick={handleDeSelect}/>
            </div>
            <UIPanel key={"selected_content_"+props.itemType} data-grid={{x: 13, y: 0, w: 11, h: 5}} level="level_3">
                <SimpleContent name={"Selected " + props.itemType} content={
                    <SelectableList items={props.selected_items} selected_item={selected_highlight} onSelect={set_selected_highlight} />
                }/>
            </UIPanel>
        </ResponsiveGridLayout>
    );
};
