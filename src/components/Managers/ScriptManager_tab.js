import React, {useEffect, useState} from 'react';


import {useDispatch, useSelector} from "react-redux"

import DataTable from 'react-data-table-component';
import {TableStyle} from './TableStyles'


import {BlockLayout, Button, ManagerButtonsLayout, ManagerLayout} from "../UI_elements"
import {setSetting} from "../../redux/Actions/SettingsActions";

import ScriptsEditor from "./ScriptsEditor";


let columns = [
    {
        selector: 'id',
        name: 'Script ID',
        sort: true
    },
    {
        selector: 'name',
        name: 'Script Name',
        sort: true,
        grow:2
    },
    {
        selector: 'path',
        name: 'Script Filename',
        grow:3
    },
    {
        selector: 'triggers',
        name: 'Script Triggers',
        grow:3
    }
];

let ScriptManager = (props) =>{

    const scripts_store = useSelector(state => state.scripts);
    const settings = useSelector(state => state.settings);

    const dispatch = useDispatch();

    const [selected, set_selected] = useState(null);

    useEffect(() => {
        return() =>{
            set_selected(null);
        }
    },[dispatch]);

    const [editor_open, set_editor_open] = useState(false);

    let handleOnSelect = (selection) => {
        if(!selection.allSelected && selection.selectedCount===1){
            set_selected(selection.selectedRows[0].id);
        } else if(selection.selectedCount===0) {
            set_selected(null);
        }

    };

    let handleAddRow = () =>{
        let id = null;
        for(let i=1;i<=scripts_store.length;i++){
            if(scripts_store[i-1].id !== i){
                id = i;
                break;
            }
        }
        if(id===null){
            id = scripts_store.length+1;
        }

        let new_script = { id:id, name:'new script', path:'', triggers:''};
        settings.server.script_proxy.upload_script(new_script);
        //The state modification is not needed in this case, it is only used to trigger the table's reload
        set_selected(selected);
    };

    let handleRemoveRow = (event) =>{
        let removed = scripts_store.find(x => x.id === selected);
        settings.server.script_proxy.delete_script(settings.server.script_proxy.delete_script(removed));
        set_selected(null);
    };

    let handleScriptConfigurationSave = () =>{
    };


    let handleScriptEdit = () => {
        let script = scripts_store.find(x => x.id === selected);
        set_editor_open(true);
        dispatch(setSetting(["script_editor_title", script.path]));
    };

    let handle_edit_done = () =>{
        set_editor_open(false);
    }

    if(editor_open) {
        return (
            <ManagerLayout>
                <ScriptsEditor done={handle_edit_done} />
            </ManagerLayout>
            );
    }

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
                data={scripts_store}
                columns={columns}
                customStyles={TableStyle}
                theme="uScopeTableTheme"
                selectableRows
                onSelectedRowsChange={handleOnSelect}
            />
        </BlockLayout>
        <Button  outline confirm onClick={handleScriptConfigurationSave}>Save scripts configuration</Button>
    </ManagerLayout>
    );
}


export default ScriptManager;
