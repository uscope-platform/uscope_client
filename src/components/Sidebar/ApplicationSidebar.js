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


import {download_json, get_next_id, import_application, up_application, upload_json} from "../../client_core";
import {
    ColorTheme,
    SelectableList,
    SimpleContent,
    UIPanel
} from "../UI_elements";
import {Responsive, WidthProvider} from "react-grid-layout";
import {setSetting} from "../../redux/Actions/SettingsActions";
import {addApplication} from "../../redux/Actions/applicationActions";
import {MdNoteAdd, MdDownload, MdUpload} from "react-icons/md";

import {Tooltip} from "react-tooltip";
import 'react-tooltip/dist/react-tooltip.css'

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

    let constructActionsBar = () =>{
        let io_color = settings.selected_application ? ColorTheme.icons_color:"gray";
        let click_handler = settings.selected_application ? handleExport:null;
        let export_tooltip = settings.selected_application ? <Tooltip anchorId="export_icon" content="Export Application" place="top" />:null;
        return(
            <div style={{display:"flex", marginRight:"0.5em", justifyContent:"right"}}>
                <div id="add_icon">
                    <MdNoteAdd onClick={handleAdd} size={ColorTheme.icons_size} style={{marginLeft:"0.3em"}} color={ColorTheme.icons_color}/>
                    <Tooltip anchorId="add_icon" content="Add Application" place="top" />
                </div>
                <div id="import_icon">
                    <MdUpload onClick={handleImport} size={ColorTheme.icons_size} style={{marginLeft:"0.3em"}} color={ColorTheme.icons_color}/>
                    <Tooltip anchorId="import_icon" content="Import Application" place="top" />
                </div>
                <div id="export_icon">
                    <MdDownload onClick={click_handler} size={ColorTheme.icons_size} style={{marginLeft:"0.3em"}} color={io_color}/>
                    {
                        export_tooltip
                    }
                </div>
            </div>
        )
    }

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
                        {
                            constructActionsBar()
                        }
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
