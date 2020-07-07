import React, {Component}  from 'react';

import { LinkContainer } from 'react-router-bootstrap'
import {connect} from "react-redux"


import Button from "../UI_elements/Button"
import {setSetting} from "../../redux/Actions/SettingsActions";

import DataTable   from 'react-data-table-component';
import {TableStyle} from './TableStyles'

import BlockLayout from "../UI_elements/BlockLayout";
import ManagerLayout, {ManagerButtonsLayout} from "../UI_elements/ManagerLayout";

function mapStateToProps(state) {
    return{
        applications:state.applications,
        settings:state.settings,
    }
}

const mapDispatchToProps = dispatch => {
    return{
        setSetting: (name, value) => {dispatch(setSetting([name, value]))},
    }
};


class ApplicationsManager extends Component {
    constructor(props) {
        super(props);
        this.state = {selected:null};

        this.applications = [];
        // eslint-disable-next-line
        for(let item in this.props.applications){
            this.applications.push({...this.props.applications[item], application_name:item});
        }

        this.selectRow = {
            mode: 'radio',
            clickToEdit: true,
            clickToSelect: true,
            selected: this.state.selected,
            onSelect: this.handleOnSelect,
        };
    }


    columns = [
        {
            selector: 'application_name',
            name: 'Application Name',
            sortable: true,

        }
    ];


    handleOnSelect = (selection) => {
        if(!selection.allSelected && selection.selectedCount===1){
            this.setState(() => ({
                selected: selection.selectedRows[0].application_name
            }));
        } else if(selection.selectedCount===0) {
            this.setState(() => ({
                selected: null
            }));
        }
    };


    handleRemoveRow = (event) =>{
        this.applications.splice(this.applications.findIndex(item => item.application_name === this.state.selected), 1);
        this.props.server.app_proxy.removeApplication(this.state.selected);
        this.setState({selected:null});
    };

    handleExport = (event) =>{
        if(this.state.selected===null){
            alert("Please select a peripheral to Export");
            return;
        }

        let application = {[this.state.selected]:this.applications[this.applications.findIndex(item => item.application_name === this.state.selected)]};
        let blob = new Blob([JSON.stringify(application, null, 4)], {type: "application/json"});
        let url  = URL.createObjectURL(blob);

        let link = document.createElement('a');
        link.href = url;
        link.download = this.state.selected;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    handleImport = (event) =>{

        let input = document.createElement('input');
        input.type = 'file';
        input.setAttribute('style', 'display:none');
        input.onchange = e => {
            let file = e.target.files[0];
            let reader = new FileReader();
            reader.readAsText(file,'UTF-8');

            reader.onload = readerEvent => {
                let content = readerEvent.target.result; // this is the content!
                this.addPeripheral(content)
            }
        };
        document.body.appendChild(input);
        input.click();

    };

    addPeripheral = (content) => {
        this.props.server.app_proxy.createApplication(JSON.parse(content), null);
    };

    handleCreate = () => {
        this.props.setSetting("edit_application_mode", false);
        this.props.setSetting("edit_application_name", null);
        return true
    };

    handleEdit = (content) => {
        if(this.state.selected===null){
            return false;
        }
        this.props.setSetting("edit_application_mode", true);
        this.props.setSetting("edit_application_name", this.state.selected);
        return true;
    };


    is_editable = (peripheral) =>{
        return this.state.selected !== null;
    };


    render(){
        return(
            <ManagerLayout>
                <ManagerButtonsLayout>
                    <LinkContainer to="/application_creator">
                        <Button outline confirm onClick={this.handleCreate}> Add application</Button>
                    </LinkContainer>

                    <Button outline deny  onClick={this.handleRemoveRow}> Remove application</Button>
                    <Button outline onClick={this.handleImport}>Import application</Button>
                    <Button outline onClick={this.handleExport}>Export application</Button>
                    <LinkContainer isActive={this.is_editable} to="/application_creator">
                        <Button outline onClick={this.handleEdit}>Edit application</Button>
                    </LinkContainer>
                </ManagerButtonsLayout>
                <BlockLayout centered>
                    <DataTable
                        title='Applications'
                        data={this.applications}
                        columns={this.columns}
                        theme="uScopeTableTheme"
                        customStyles={TableStyle}
                        selectableRows
                        onSelectedRowsChange={this.handleOnSelect}
                    />
                </BlockLayout>

            </ManagerLayout>
        );
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ApplicationsManager);
