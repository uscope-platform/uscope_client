import React, {Component}  from 'react';

import { LinkContainer } from 'react-router-bootstrap'
import {connect} from "react-redux"

import BootstrapTable from 'react-bootstrap-table-next';
import cellEditFactory from 'react-bootstrap-table2-editor';
import paginationFactory from 'react-bootstrap-table2-paginator';

import Button from "../UI_elements/Button"
import {setSetting} from "../../redux/Actions/SettingsActions";
import styled from "styled-components";


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

const ComponentLayout = styled.div`
  display: grid;
  grid-template-columns: auto;
  grid-auto-rows: auto;
  grid-gap: 2rem;
`
const ButtonsLayout = styled.div`
  display: flex;
  grid-template-columns: auto;
  grid-auto-rows: auto;
  grid-gap: 2rem;
`


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
            dataField: 'application_name',
            text: 'Application Name',
            sort: true
        }
    ];


    handleOnSelect = (row, isSelect) => {
        if (isSelect) {
            this.setState(() => ({
                selected: row.application_name
            }));
        } else {
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
            <ComponentLayout>
                <ButtonsLayout>
                    <LinkContainer to="/application_creator">
                        <Button outline confirm onClick={this.handleCreate}> Add application</Button>
                    </LinkContainer>

                    <Button outline deny  onClick={this.handleRemoveRow}> Remove application</Button>
                    <Button outline onClick={this.handleImport}>Import application</Button>
                    <Button outline onClick={this.handleExport}>Export application</Button>
                    <LinkContainer isActive={this.is_editable} to="/application_creator">
                        <Button outline onClick={this.handleEdit}>Edit application</Button>
                    </LinkContainer>
                </ButtonsLayout>
                <BootstrapTable
                    keyField='application_name'
                    data={this.applications}
                    columns={this.columns}
                    cellEdit={ cellEditFactory({
                        mode: 'click',
                        blurToSave: true
                    })}
                    pagination={ paginationFactory() }
                    selectRow={ this.selectRow }
                />
            </ComponentLayout>
        );
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ApplicationsManager);
