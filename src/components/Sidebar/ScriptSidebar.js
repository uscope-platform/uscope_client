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

import React, {useEffect} from 'react';

import {useDispatch, useSelector} from "react-redux"



import {Button, SelectableList, SimpleContent, UIPanel} from "../UI_elements"
import {setSetting} from "../../redux/Actions/SettingsActions";

import {get_next_id, up_script} from "../../client_core";
import {Responsive, WidthProvider} from "react-grid-layout";


let ScriptManager = (props) =>{

    const scripts_store = useSelector(state => state.scripts);
    const settings = useSelector(state => state.settings);

    const dispatch = useDispatch();

    useEffect(() => {
        return() =>{
            dispatch(setSetting(["selected_script", null]));
        }
    },[dispatch]);

    const ResponsiveGridLayout = WidthProvider(Responsive);

    let selected_script = {name:""};
    if(settings.selected_script)
        selected_script = scripts_store[settings.selected_script];

    let handleAddRow = () =>{
        let id = get_next_id(Object.values(scripts_store).map(a => a.id).sort());
        let script = up_script.construct_empty(id);
        script.add_remote().then();
    };

    let handleRemove = (script) =>{
        let deleted = Object.values(scripts_store).filter((scr)=>{
            return scr.name === script;
        })[0];
        dispatch(setSetting(["selected_script", null]));
        up_script.delete_script(deleted).then();
    };


    let get_content = () =>{
        let types = [];
        let items = Object.values(scripts_store).map((scr)=>{
            types.push("generic");
            return scr.name;
        })

        return [items, types]
    }


    const [names, types] = get_content();

    let handleSelect = (item) =>{
        if(settings.selected_script !==item){
            let selected_script = Object.values(scripts_store).filter((scr)=>{
                return scr.name === item;
            })[0];
            dispatch(setSetting(["selected_script", selected_script.id]));
        }
    };


    return(
        <ResponsiveGridLayout
            className="layout"
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
            cols={{ lg: 24, md: 20, sm: 12, xs: 8, xxs: 4 }}
            useCSSTransforms={false}
        >
            <UIPanel key="script_props" data-grid={{x: 0, y: 0, w: 24, h: 6, static: true}} level="level_2">
                <SimpleContent name="Script List" content={
                    <SelectableList items={names} types={types} selected_item={selected_script.name} onRemove={handleRemove} onSelect={handleSelect} />
                }/>
            </UIPanel>
            <UIPanel key="script_actions" data-grid={{x: 0, y: 6, w: 24, h: 1, static: true}} level="level_2">
                <SimpleContent name="Script Actions" content={
                    <div style={{display:"flex", flexDirection:"column"}} >
                        <Button style={{margin:"0.5em 1rem"}}  onClick={handleAddRow}>Add Script</Button>
                    </div>
                }/>
            </UIPanel>
        </ResponsiveGridLayout>
    );
}


export default ScriptManager;
