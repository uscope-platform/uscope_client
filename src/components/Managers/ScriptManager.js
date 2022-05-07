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

import React, {useEffect, useState} from 'react';

import {useDispatch, useSelector} from "react-redux"

import DataTable from 'react-data-table-component';
import {TableStyle} from './TableStyles'


import {BlockLayout, Button, ManagerButtonsLayout, ManagerLayout} from "../UI_elements"
import {setSetting} from "../../redux/Actions/SettingsActions";

import ScriptsEditor from "../Editors/Scripts/ScriptsEditor";
import {up_script} from "../../client_core/data_models/up_script";

let columns = [
    {
        selector: row => row.id,
        name: 'Script ID',
        sort: true
    },
    {
        selector: row => row.name,
        name: 'Script Name',
        sort: true,
        grow:2
    },
    {
        selector: row => row.path,
        name: 'Script Filename',
        grow:3
    },
    {
        selector: row => row.triggers,
        name: 'Script Triggers',
        grow:3
    }
];

let ScriptManager = (props) =>{

    const scripts_store = useSelector(state => state.scripts);
    const settings = useSelector(state => state.settings);

    const dispatch = useDispatch();

    useEffect(() => {
        return() =>{
            dispatch(setSetting(["selected_script", null]));
        }
    },[dispatch]);

    const [editor_open, set_editor_open] = useState(false);

    const selected_script = new up_script(scripts_store[settings.selected_script]);

    let handleOnSelect = (selection) => {
        if(selection.selectedCount===1){
            dispatch(setSetting(["selected_script", selection.selectedRows[0].id]));
        } else if(selection.selectedCount===0) {
            dispatch(setSetting(["selected_script", null]));
        }
    };

    let get_next_id =(ids) => {
        let id = null;
        if(ids.length === 0) return 1;
        for(var i = 1; i < ids.length; i++) {
            if(ids[i] - ids[i-1] !== 1) {
                id = ids[i-1]+1;
            }
        }
        if(id===null)
            id = ids.length+1;
        return id
    }

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
        set_editor_open(true);
        dispatch(setSetting(["script_editor_title", selected_script.name]));
    };

    let handle_edit_done = () =>{
        set_editor_open(false);
    }

    if(editor_open) {
        return (
            <ManagerLayout>
                <ScriptsEditor script={selected_script} done={handle_edit_done} />
            </ManagerLayout>
            );
    }

    const rowSelectCritera = row => row.id === settings.selected_script;

    return(
    <ManagerLayout>
        <ManagerButtonsLayout>
            <Button style={{margin:"0 1rem"}} onClick={handleAddRow}>Add Script</Button>
            <Button style={{margin:"0 1rem"}} onClick={handleRemoveRow}>Remove Script</Button>
            <Button style={{margin:"0 1rem"}} onClick={handleScriptEdit}>Edit Script</Button>
        </ManagerButtonsLayout>
        <BlockLayout centered>
            <DataTable
                title='Scripts'
                data={Object.values(scripts_store)}
                columns={columns}
                customStyles={TableStyle}
                theme="uScopeTableTheme"
                selectableRows
                onSelectedRowsChange={handleOnSelect}
                selectableRowSelected={rowSelectCritera}
            />
        </BlockLayout>
    </ManagerLayout>
    );
}


export default ScriptManager;
