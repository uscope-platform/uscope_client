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

import React from 'react';

import {useDispatch, useSelector} from "react-redux";


import {download_json, get_next_id, import_application, up_application, upload_json} from "../../client_core";
import {
    SelectableList,
    SimpleContent,
    UIPanel
} from "../UI_elements";
import {Responsive, WidthProvider} from "react-grid-layout";
import {setSetting} from "../../redux/Actions/SettingsActions";
import {addApplication} from "../../redux/Actions/applicationActions";

import 'react-tooltip/dist/react-tooltip.css'
import SideToolbar from "./SideToolbar";

let  ApplicationSidebar = props =>{

    const applications_redux = useSelector(state => state.applications);
    const settings = useSelector(state => state.settings);

    const dispatch = useDispatch();


    let  handleRemove = (app) =>{
        dispatch(setSetting(["selected_application", null]));
        up_application.delete_application(app).then();
    };

    let handleExport = (event) =>{
        download_json(applications_redux[settings.selected_application],settings.selected_application);

    };

    let handleImport = (event) =>{
        upload_json().then((app)=>{
            import_application(app).then(()=>{
                addApplication(app);
            })
        })
    };

    let handleAdd = (content) => {
        let ids = Object.values(applications_redux).map((app)=>{
            const regex = /new_application_(\d+)/g;
            let match = Array.from(app.application_name.matchAll(regex), m => m[1]);
            if(match.length>0){
                return match;
            } else {
                return undefined;
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
                    <div>
                        <SideToolbar
                            onAdd={handleAdd}
                            onImport={handleImport}
                            onExport={handleExport}
                            contentName="Applications"
                            exportEnabled={settings.selected_application}
                        />
                        <SelectableList
                            items={names}
                            types={types}
                            selected_item={settings.selected_application}
                            onRemove={handleRemove}
                            onSelect={handleSelect}
                        />
                    </div>
                }/>
            </UIPanel>
        </ResponsiveGridLayout>
    );

};

export default ApplicationSidebar;