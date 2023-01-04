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

import {
    Button,
    ManagerButtonsLayout,
    ManagerLayout, TabbedContent, UIPanel
} from "../UI_elements"
import {setSetting} from "../../redux/Actions/SettingsActions";

import DataTable from 'react-data-table-component';
import {TableStyle} from './TableStyles'
import {up_application, import_application, get_next_id} from "../../client_core";
import {addApplication} from "../../redux/Actions/applicationActions";
import {Responsive, WidthProvider} from "react-grid-layout";


let columns = [
    {
        selector: row => row.application_name,
        name: 'Application Name',
        sortable: true,
    }
];

let  ApplicationsManager = props =>{


    const applications_redux = useSelector(state => state.applications);
    const settings = useSelector(state => state.settings);

    const dispatch = useDispatch();

    useEffect(() => {
        return() =>{
            dispatch(setSetting(["current_application", null]));
        }
    },[dispatch]);

    let handleOnSelect = (selection) => {
        if(selection.selectedCount===1){
            if(settings.current_application !==selection.selectedRows[0].application_name){
                dispatch(setSetting(["current_application", selection.selectedRows[0].application_name]));
            }
        } else if(selection.selectedCount===0) {
            if(settings.current_application !==null){
                dispatch(setSetting(["current_application", null]))
            }
        }
    };


    let  handleRemoveRow = (event) =>{
        up_application.delete_application(settings.current_application).then(()=>{
            dispatch(setSetting(["current_application", null]))
        });
    };

    let handleExport = (event) =>{
        if(settings.current_application===null){
            alert("Please select an Application to Export");
            return;
        }

        let blob = new Blob([JSON.stringify(applications_redux[settings.current_application], null, 4)], {type: "application/json"});
        let url  = URL.createObjectURL(blob);

        let link = document.createElement('a');
        link.href = url;
        link.download = settings.current_application;
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
        debugger;
        ids = ids.filter(Boolean);
        let id = get_next_id(ids.sort());
        up_application.construct_empty("new_application_"+id).add_remote().then();
    };

    const rowSelectCritera = row => row.application_name === settings.current_application;


    let get_tabs_content = ()=>{
        return([
            <div>
                <ManagerLayout>
                    <ManagerButtonsLayout>
                        <Button style={{margin:"0 1rem"}} onClick={handleAdd}> Add application</Button>
                        <Button style={{margin:"0 1rem"}} onClick={handleRemoveRow}> Remove application</Button>
                        <Button style={{margin:"0 1rem"}} onClick={handleImport}>Import application</Button>
                        <Button style={{margin:"0 1rem"}} onClick={handleExport}>Export application</Button>
                    </ManagerButtonsLayout>

                    <DataTable
                        title='Applications'
                        data={Object.values(applications_redux)}
                        columns={columns}
                        theme="uScopeTableTheme"
                        customStyles={TableStyle}
                        selectableRows
                        onSelectedRowsChange={handleOnSelect}
                        selectableRowSelected={rowSelectCritera}
                    />


                </ManagerLayout>
            </div>,
            <div>
                <p>TEST</p>
            </div>
        ])
    }

    let get_tabs_names = ()=>{
        return ["Old", "New"]
    }
    const ResponsiveGridLayout = WidthProvider(Responsive);


    return(
        <ResponsiveGridLayout
            className="layout"
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
            cols={{ lg: 24, md: 20, sm: 12, xs: 8, xxs: 4 }}
        >
            <UIPanel key="new_props" data-grid={{x: 2, y: 0, w: 24, h: 6}} level="level_2">
                <TabbedContent names={get_tabs_names()} contents={get_tabs_content()}/>
            </UIPanel>
        </ResponsiveGridLayout>
    );

};


export default ApplicationsManager;
