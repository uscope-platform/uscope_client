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



    let handleAddRow = () =>{
        let id = get_next_id(Object.values(scripts_store).map(a => a.id).sort());
        let script = up_script.construct_empty(id);
        script.add_remote().then();
    };

    let handleRemoveRow = (event) =>{
        dispatch(setSetting(["selected_script", null]));
        up_script.delete_script(scripts_store[settings.selected_script]).then();
    };

    let handleScriptEdit = () => {
        if(settings.selected_script===null){
            alert("Please select a script to edit");
            return;
        }
        dispatch(setSetting(["script_editor_title", settings.selected_script]));
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
            dispatch(setSetting(["selected_script", item]));
        }
    };

    return(
        <ResponsiveGridLayout
            className="layout"
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
            cols={{ lg: 24, md: 20, sm: 12, xs: 8, xxs: 4 }}
            useCSSTransforms={false}
        >
            <UIPanel key="script_props" data-grid={{x: 2, y: 0, w: 24, h: 3, static: true}} level="level_2">
                <SimpleContent name="Script List" content={
                    <SelectableList items={names} types={types} selected_item={settings.selected_script} onSelect={handleSelect} />
                }/>
            </UIPanel>
            <UIPanel key="script_actions" data-grid={{x: 2, y: 3, w: 24, h: 3, static: true}} level="level_2">
                <SimpleContent name="Script Actions" content={
                    <div style={{display:"flex", flexDirection:"column"}} >
                        <Button style={{margin:"0.5em 1rem"}}  onClick={handleAddRow}>Add Script</Button>
                        <Button style={{margin:"0.5em 1rem"}}  onClick={handleRemoveRow}>Remove Script</Button>
                        <Button  style={{margin:"0.5em 1rem"}}  onClick={handleScriptEdit}>Edit Script</Button>
                    </div>
                }/>
            </UIPanel>
        </ResponsiveGridLayout>
    );
}


export default ScriptManager;
