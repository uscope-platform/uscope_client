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
import {UIPanel} from "../../panels/UIPanel";
import {SimpleContent} from "../../panels/SimpleContent";
import {Responsive, WidthProvider} from "react-grid-layout";
import {MdArrowBack, MdArrowForward} from "react-icons/all";
import {SelectableList} from "../../SelectableList";
import {MdPerson} from "react-icons/md";
import {ColorTheme} from "../../ColorTheme";
import {useSelector} from "react-redux";
import {up_application} from "../../../../client_core";


export let  ScriptsSelector = props =>{


    const scripts_redux = useSelector(state => state.scripts);

    let [available_highlight, set_available_highlight] = useState("");
    let [selected_highlight, set_selected_highlight] = useState("");


    let handleSelect = () =>{
        let script = Object.keys(scripts_redux).filter((s)=>{
            return scripts_redux[s].name === available_highlight;
        })[0];
        let app = new up_application(props.application);
        app.add_selected_script(script).then(()=>{
            props.forceUpdate();
        });
    }

    let handleDeSelect = () =>{
        let script = Object.keys(scripts_redux).filter((s)=>{
            return scripts_redux[s].name === selected_highlight;
        })[0];
        let selected_application = new up_application(props.application);
        selected_application.remove_selected_script(script).then(()=>{
            props.forceUpdate();
        });
    }

    const ResponsiveGridLayout = WidthProvider(Responsive);


    let get_scripts = () =>{

        let select_types = [];
        let select_items = props.scripts.map((scr)=>{
            select_types.push(null);
            return scripts_redux[scr].name;
        })


        let avail_types = [];
        let avail_items = Object.values(scripts_redux).filter((val)=>{
            return !select_items.includes(val.name);
        }).map((scr)=>{
            avail_types.push(null);
            return scr.name;
        })

        return [avail_items, avail_types, select_items, select_types]
    }


    const [avail_names, avail_types, select_names, select_types] = get_scripts();


    return(
        <ResponsiveGridLayout
            className="layout"
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
            cols={{ lg: 24, md: 20, sm: 12, xs: 8, xxs: 4 }}
            useCSSTransforms={false}
        >
            <UIPanel key="scripts_list" data-grid={{x: 0, y: 0, w: 11, h: 5}} level="level_3">
                <SimpleContent name="Available Scripts" content={
                    <SelectableList items={avail_names} types={avail_types} selected_item={available_highlight} onSelect={set_available_highlight} />
                }/>
            </UIPanel>
            <div key="controls" data-grid={{x: 11, y: 0, w: 2, h: 5}} style={{
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
            <UIPanel key="selected_scripts" data-grid={{x: 13, y: 0, w: 11, h: 5}} level="level_3">
                <SimpleContent name="Selected Scripts" content={
                    <SelectableList items={select_names} types={select_types} selected_item={selected_highlight} onSelect={set_selected_highlight} />
                }/>
            </UIPanel>
        </ResponsiveGridLayout>
    );
};
