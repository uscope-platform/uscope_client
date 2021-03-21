import React, {useEffect} from 'react';

import {useDispatch, useSelector} from "react-redux"


import {BlockLayout, Button, ManagerButtonsLayout, ManagerLayout} from "../UI_elements"
import {setSetting} from "../../redux/Actions/SettingsActions";

import DataTable from 'react-data-table-component';
import {TableStyle} from './TableStyles'


let columns = [
    {
        selector: 'application_name',
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
        settings.server.app_proxy.removeApplication(settings.current_application);
        dispatch(setSetting(["current_application", null]))
    };

    let handleExport = (event) =>{
        if(settings.current_application===null){
            alert("Please select an Application to Export");
            return;
        }

        let application = {[settings.current_application]:applications_redux[settings.current_application]};
        let blob = new Blob([JSON.stringify(application, null, 4)], {type: "application/json"});
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
                addApplication(content)
            }
        };
        document.body.appendChild(input);
        input.click();

    };

    let addApplication = (content) => {
        settings.server.app_proxy.createApplication(JSON.parse(content), null);
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
