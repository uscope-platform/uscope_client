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

import {BlockLayout, Button, ManagerButtonsLayout, ManagerLayout} from "../UI_elements"
import {setSetting} from "../../redux/Actions/SettingsActions";

import DataTable from 'react-data-table-component';
import {TableStyle} from './TableStyles'
import {up_application, import_application} from "../../client_core";
import {addApplication} from "../../redux/Actions/applicationActions";


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
            dispatch(setSetting(["current_application", selection.selectedRows[0].application_name]))
        } else if(selection.selectedCount===0) {
            dispatch(setSetting(["current_application", null]))
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
                handle_application_add(content)
            }
        };
        document.body.appendChild(input);
        input.click();

    };

    let handle_application_add = (content) => {
        import_application(content).then((app)=>{
            addApplication(app)
        }).catch((err)=>{
            alert(err);
        });
    };

    const rowSelectCritera = row => row.application_name === settings.current_application;

    return(
        <ManagerLayout>
            <ManagerButtonsLayout>
                <Button style={{margin:"0 1rem"}} onClick={handleRemoveRow}> Remove application</Button>
                <Button style={{margin:"0 1rem"}} onClick={handleImport}>Import application</Button>
                <Button style={{margin:"0 1rem"}} onClick={handleExport}>Export application</Button>
            </ManagerButtonsLayout>
            <BlockLayout centered>
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
            </BlockLayout>

        </ManagerLayout>
    );
};


export default ApplicationsManager;
