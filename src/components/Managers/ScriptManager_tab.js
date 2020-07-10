import React, {useState} from 'react';


import {useDispatch, useSelector} from "react-redux"

import DataTable from 'react-data-table-component';
import {TableStyle} from './TableStyles'


import Button from "../UI_elements/Button"
import {setSetting} from "../../redux/Actions/SettingsActions";
import {LinkContainer} from "react-router-bootstrap";
import BlockLayout from "../UI_elements/Layouts/BlockLayout";
import ManagerLayout, {ManagerButtonsLayout} from "../UI_elements/Layouts/ManagerLayout";


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

    const dispatch = useDispatch();

    const [selected, set_selected] = useState(null);
    const [removed_scripts, set_removed_scripts] = useState([]);
    const [scripts, set_scripts] = useState(()=>{
        return JSON.parse(JSON.stringify(scripts_store));
    });


    let handleOnSelect = (selection) => {
        if(!selection.allSelected && selection.selectedCount===1){
            set_selected(selection.selectedRows[0].id);
        } else if(selection.selectedCount===0) {
            set_selected(null);
        }

    };

    let handleAddRow = () =>{
        let id = null;
        for(let i=1;i<=scripts.length;i++){
            if(scripts[i-1].id !== i){
                id = i;
                break;
            }
        }
        if(id===null){
            id = scripts.length+1;
        }

        scripts.push({
            id:id,
            name:'new script',
            path:'',
            triggers:''
        });
        //The state modification is not needed in this case, it is only used to trigger the table's reload
        set_selected(selected);
    };

    let handleRemoveRow = (event) =>{
        let removed = scripts.find(x => x.id === selected);
        scripts.splice(scripts.findIndex(item => item.id === selected), 1);
        this.setState(() => ({
            removed_scripts: [...removed_scripts, ...[removed]]
        }));
        set_selected(null);
    };

    let handleScriptConfigurationSave = () =>{
        //HANDLE ADDITIONS
        let difference = scripts.filter((element) => {
            let presence = scripts_store.filter((curr_obj) => {
                return JSON.stringify(curr_obj) === JSON.stringify(element)
            });
            return !(presence && presence.length);
        });

        // eslint-disable-next-line
        for(let script of difference){
            props.server.script_proxy.upload_script(script);
        }
        //HANDLE DELETIONS
        // eslint-disable-next-line
        for(let script of removed_scripts){
            props.server.script_proxy.delete_script(script);
        }
    };

    let is_editable = () =>{
        return selected !== null;
    };

    let handleScriptEdit = () => {
        let script = scripts.find(x => x.id === selected);
        dispatch(setSetting(["scriptEditor_title", script.path]));
    };

    return(
        <ManagerLayout>
            <ManagerButtonsLayout>
                <Button onClick={handleAddRow}>Add Script</Button>
                <Button onClick={handleRemoveRow}>Remove Script</Button>
                <LinkContainer isActive={is_editable} to="/script_creator">
                    <Button onClick={handleScriptEdit}>Edit Script</Button>
                </LinkContainer>
            </ManagerButtonsLayout>
            <BlockLayout centered>
                <DataTable
                    title='Scripts'
                    data={scripts}
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
