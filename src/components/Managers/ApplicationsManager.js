import React, {useState} from 'react';

import { LinkContainer } from 'react-router-bootstrap'
import {useDispatch, useSelector} from "react-redux"


import Button from "../UI_elements/Button"
import {setSetting} from "../../redux/Actions/SettingsActions";

import DataTable   from 'react-data-table-component';
import {TableStyle} from './TableStyles'

import BlockLayout from "../UI_elements/Layouts/BlockLayout";
import ManagerLayout, {ManagerButtonsLayout} from "../UI_elements/Layouts/ManagerLayout";


let columns = [
    {
        selector: 'application_name',
        name: 'Application Name',
        sortable: true,
    }
];

let  ApplicationsManager = props =>{


    const applications_redux = useSelector(state => state.applications);

    const dispatch = useDispatch();

    const [selected, set_selected] = useState(null);
    const [applications, set_applications] = useState(()=>{
        let applications = [];
        for(let item in applications_redux){
            applications.push({...applications_redux[item], application_name:item});
        }
        return applications;
    });


    let handleOnSelect = (selection) => {
        if(!selection.allSelected && selection.selectedCount===1){
            set_selected(selection.selectedRows[0].application_name)
        } else if(selection.selectedCount===0) {
            set_selected(null)
        }
    };


    let  handleRemoveRow = (event) =>{
        applications.splice(applications.findIndex(item => item.application_name === selected), 1);
        props.server.app_proxy.removeApplication(selected);
        set_selected(null);
    };

    let handleExport = (event) =>{
        if(selected===null){
            alert("Please select an Application to Export");
            return;
        }

        let application = {[selected]:applications[applications.findIndex(item => item.application_name === selected)]};
        let blob = new Blob([JSON.stringify(application, null, 4)], {type: "application/json"});
        let url  = URL.createObjectURL(blob);

        let link = document.createElement('a');
        link.href = url;
        link.download = selected;
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
        props.server.app_proxy.createApplication(JSON.parse(content), null);
    };

    let handleCreate = () => {
        dispatch(setSetting(["edit_application_mode", false]));
        dispatch(setSetting(["edit_application_name", null]));

        return true
    };

    let handleEdit = () => {
        if(selected===null){
            return false;
        }
        dispatch(setSetting(["edit_application_mode", true]));
        dispatch(setSetting(["edit_application_name", selected]));
        return true;
    };

    let is_editable = () =>{
        return selected !== null;
    };

    return(
        <ManagerLayout>
            <ManagerButtonsLayout>
                <LinkContainer to="/application_creator">
                    <Button onClick={handleCreate}> Add application</Button>
                </LinkContainer>

                <Button onClick={handleRemoveRow}> Remove application</Button>
                <Button onClick={handleImport}>Import application</Button>
                <Button onClick={handleExport}>Export application</Button>
                <LinkContainer isActive={is_editable} to="/application_creator">
                    <Button onClick={handleEdit}>Edit application</Button>
                </LinkContainer>
            </ManagerButtonsLayout>
            <BlockLayout centered>
                <DataTable
                    title='Applications'
                    data={applications}
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


export default ApplicationsManager;
