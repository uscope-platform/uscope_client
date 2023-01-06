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

import {useDispatch, useSelector} from "react-redux";


import {get_next_id, import_application, up_application} from "../../client_core";
import {
    Button,
    SelectableList,
    SimpleContent,
    UIPanel
} from "../UI_elements";
import {Responsive, WidthProvider} from "react-grid-layout";
import {setSetting} from "../../redux/Actions/SettingsActions";
import {addApplication} from "../../redux/Actions/applicationActions";

let  ApplicationSidebar = props =>{

    const applications_redux = useSelector(state => state.applications);
    const settings = useSelector(state => state.settings);

    const dispatch = useDispatch();

    useEffect(() => {
        return() =>{
            dispatch(setSetting(["selected_application", null]));
        }
    },[dispatch]);


    let  handleRemove = (app) =>{
        up_application.delete_application(app).then(()=>{
            dispatch(setSetting(["selected_application", null]))
        });
    };

    let handleExport = (event) =>{
        if(settings.selected_application===null){
            alert("Please select an Application to Export");
            return;
        }

        let blob = new Blob([JSON.stringify(applications_redux[settings.selected_application], null, 4)], {type: "application/json"});
        let url  = URL.createObjectURL(blob);

        let link = document.createElement('a');
        link.href = url;
        link.download = settings.selected_application;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    let handleImport = (event) =>{

        let input = document.createElement('input');
        input.type = 'file';
        input.setAttribute('style', 'display:none');
        input.onchange = e => {
            let file = e.target.files[0];
            let reader = new FileReader();
            reader.readAsText(file,'UTF-8');

            reader.onload = readerEvent => {
                let content = readerEvent.target.result; // this is the content!
                import_application(content).then((app)=>{
                    addApplication(app)
                }).catch((err)=>{
                    alert(err);
                });
            }
        };
        document.body.appendChild(input);
        input.click();

    };

    let handleAdd = (content) => {
        let ids = Object.values(applications_redux).map((app)=>{
            const regex = /new_application_(\d+)/g;
            let match = Array.from(app.application_name.matchAll(regex), m => m[1]);
            if(match.length>0){
                return match;
            }
        });
        ids = ids.filter(Boolean);
        let id = get_next_id(ids.sort());
        up_application.construct_empty("new_application_"+id).add_remote().then();
    };

    let get_content = () =>{
        let types = [];
        let items = Object.values(applications_redux).map((app)=>{
            types.push("generic");
            return app.application_name;
        })

        return [items, types]
    }

    const [names, types] = get_content();

    let handleSelect = (item) =>{
        if(settings.selected_application !==item){
            dispatch(setSetting(["selected_application", item]));
        }
    };

    const ResponsiveGridLayout = WidthProvider(Responsive);

    return(
        <ResponsiveGridLayout
            className="layout"
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
            cols={{ lg: 24, md: 20, sm: 12, xs: 8, xxs: 4 }}
            useCSSTransforms={false}
        >
            <UIPanel key="app_props" data-grid={{x: 0, y: 0, w: 24, h: 3, static: true}} level="level_2">
                <SimpleContent name="Applications List" content={
                    <SelectableList
                        items={names}
                        types={types}
                        selected_item={settings.selected_application}
                        onRemove={handleRemove}
                        onSelect={handleSelect}
                    />
                }/>
            </UIPanel>
            <UIPanel key="app_actions" data-grid={{x: 0, y: 3, w: 24, h: 3, static: true}} level="level_2">
                <SimpleContent name="Applications Actions" content={
                    <div>
                        <Button style={{margin:"0.5em 1rem"}} onClick={handleAdd}> Add application</Button>
                        <Button style={{margin:"0.5em 1rem"}} onClick={handleImport}>Import application</Button>
                        <Button style={{margin:"0.5em 1rem"}} onClick={handleExport}>Export application</Button>
                    </div>
                }/>
            </UIPanel>
        </ResponsiveGridLayout>
    );

};

export default ApplicationSidebar;
