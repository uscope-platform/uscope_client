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

import React, {useEffect, useRef, useState} from 'react';
import {useLocation} from "react-router-dom";

import {useDispatch, useSelector} from "react-redux"
import {Button, ManagerButtonsLayout, ManagerLayout} from "../UI_elements"


import DataTable from 'react-data-table-component';
import {TableStyle} from './TableStyles'
import {setSetting} from "../../redux/Actions/SettingsActions";

import {remove_user, get_users_list, dump_database, restore_database} from '../../client_core'

let columns = [
    {
        selector: row => row.username,
        name: 'Username',
        sortable: true,
    },
    {
        selector: row => row.role,
        name: 'Role'
    }
];

let  PlatformManager = props =>{
    const location = useLocation();
    const [users, setUsers] = useState([])
    const [refreshList, setRefreshList] = useState(false)
    const settings = useSelector(state => state.settings);

    const dispatch = useDispatch();

    const databaseFile = useRef(null)

    useEffect(()=>{
        get_users_list().then((response)=>{
            setUsers(response)
        })
    },[dispatch, location, settings.refresh_user_view, refreshList])

    let handleOnSelect = (selection) => {
        if(selection.selectedCount===1){
            if(settings.selected_user !==selection.selectedRows[0].username){
                dispatch(setSetting(["selected_user", selection.selectedRows[0].username]));
            }
        } else if(selection.selectedCount===0) {
            dispatch(setSetting(["selected_user", null]));
        }

    };

    let handleRemoveUser = (event) =>{
        remove_user({user:settings.selected_user}).then((response)=>{
            setRefreshList(!refreshList);
        })
    }

    let handleDumpDatabse = () =>{
        dump_database().then((response)=>{
            let encodedUri = encodeURI('data:text/json;charset=utf-8,'+ JSON.stringify(response));
            let link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", "dump.db");
            link.setAttribute("id", "csv_download_link");
            document.body.appendChild(link);

            link.click();
            link.remove();

        })

    }

    let handleRestoreButton = event =>{
        databaseFile.current.click();
    }

    let handleRestoreDatabse = (event) =>{
        let file = event.target.files[0]
        let reader = new FileReader();
        reader.readAsText(file)
        reader.onload = (event) =>{
            let content = JSON.parse(event.target.result);
            restore_database(content);
        }
        reader.onerror = (event) =>{
            alert(event.target.error.message);
        }
    }

    const rowSelectCritera = row => row.username === settings.selected_user;


    return(
        <ManagerLayout>
            <ManagerButtonsLayout>
                <Button style={{margin:"0 1rem"}} onClick={handleRemoveUser}>Remove User</Button>
                <Button style={{margin:"0 1rem"}} onClick={handleDumpDatabse}>Dump Database</Button>
                <Button style={{margin:"0 1rem"}} onClick={handleRestoreButton}>Restore Database</Button>
            </ManagerButtonsLayout>
            <DataTable
                title='Users'
                data={users}
                columns={columns}
                theme="uScopeTableTheme"
                customStyles={TableStyle}
                selectableRows
                onSelectedRowsChange={handleOnSelect}
                selectableRowSelected={rowSelectCritera}
            />
            <input type='file' id='dbFile' ref={databaseFile} onChange={handleRestoreDatabse} style={{display: 'none'}}/>
        </ManagerLayout>
    );
};


export default PlatformManager;
