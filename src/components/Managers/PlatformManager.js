import React, {useEffect, useState} from 'react';
import {useLocation} from "react-router";

import {useDispatch, useSelector} from "react-redux"
import {BlockLayout, Button, ManagerButtonsLayout, ManagerLayout} from "../UI_elements"


import DataTable from 'react-data-table-component';
import {TableStyle} from './TableStyles'
import {setSetting} from "../../redux/Actions/SettingsActions";


let columns = [
    {
        selector: 'user',
        name: 'Username',
        sortable: true,
    }
];

let  PlatformManager = props =>{
    const location = useLocation();
    const [users, setUsers] = useState([])
    const [refreshList, setRefreshList] = useState(false)
    const settings = useSelector(state => state.settings);

    const dispatch = useDispatch();

    useEffect(()=>{
        settings.server.platform_proxy.get_users_list().then((response)=>{
            let users_list = response.map(item=>{
                return {user:item};
            })
            setUsers(users_list)
        })
    },[dispatch, location, settings.refresh_user_view, refreshList])

    let handleOnSelect = (selection) => {
        if(selection.selectedCount===1){
            dispatch(setSetting(["selected_user", selection.selectedRows[0].user]));
        } else if(selection.selectedCount===0) {
            dispatch(setSetting(["selected_user", null]));
        }

    };

    let handleRemoveUser = (event) =>{
        settings.server.platform_proxy.remove_user({user:settings.selected_user}).then((response)=>{
            setRefreshList(!refreshList);
        })
    }

    let handleDumpDatabse = () =>{
        settings.server.platform_proxy.dump_database().then((response)=>{
            var encodedUri = encodeURI('data:text/json;charset=utf-8,'+ JSON.stringify(response));
            var link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", "dump.db");
            link.setAttribute("id", "csv_download_link");
            document.body.appendChild(link);

            link.click();
            link.remove();

        })

    }

    let handleRestoreDatabse = (event) =>{

    }

    return(
        <ManagerLayout>
            <ManagerButtonsLayout>
                <Button style={{margin:"0 1rem"}} onClick={handleRemoveUser}>Remove User</Button>
                <Button style={{margin:"0 1rem"}} onClick={handleDumpDatabse}>Dump Database</Button>
                <Button style={{margin:"0 1rem"}} onClick={handleRestoreDatabse}>Restore Database</Button>
            </ManagerButtonsLayout>
            <BlockLayout centered>
                <DataTable
                    title='Users'
                    data={users}
                    columns={columns}
                    theme="uScopeTableTheme"
                    customStyles={TableStyle}
                    selectableRows
                    onSelectedRowsChange={handleOnSelect}
                />
            </BlockLayout>

        </ManagerLayout>
    );
};


export default PlatformManager;
