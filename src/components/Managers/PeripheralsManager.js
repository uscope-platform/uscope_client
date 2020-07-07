import React, {Component}  from 'react';


import { LinkContainer } from 'react-router-bootstrap'
import {connect} from "react-redux"

import BootstrapTable from 'react-bootstrap-table-next';
import DataTable from 'react-data-table-component';
import {TableStyle} from './TableStyles'
import cellEditFactory from 'react-bootstrap-table2-editor';
import paginationFactory from 'react-bootstrap-table2-paginator';

import Button from "../UI_elements/Button"
import {setSetting} from "../../redux/Actions/SettingsActions";
import styled from "styled-components";
import BlockLayout from "../UI_elements/BlockLayout";
import ManagerLayout, {ManagerButtonsLayout} from "../UI_elements/ManagerLayout";



function mapStateToProps(state) {
    return{
        peripherals:state.peripherals
    }
}

const mapDispatchToProps = dispatch => {
    return{
        setSetting: (name, value) => {dispatch(setSetting([name, value]))},
    }
};


class PeripheralsManager extends Component {
    constructor(props) {
        super(props);
        this.state = {selected:null};
        this.peripherals = Object.values(this.props.peripherals);
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
            selector: 'peripheral_name',
            name: 'Peripheral Name',
            sort: true,
            grow:2
        },
        {
            selector: 'version',
            name: 'Peripheral Version'
        }
    ];


    handleOnSelect = (selection) => {
        if(!selection.allSelected && selection.selectedCount===1){
            this.setState(() => ({
                selected: selection.selectedRows[0].peripheral_name
            }));
        } else if(selection.selectedCount===0) {
            this.setState(() => ({
                selected: null
            }));
        }
    };


    handleRemoveRow = (event) =>{
        this.peripherals.splice(this.peripherals.findIndex(item => item.peripheral_name === this.state.selected), 1);
        this.props.server.creator_proxy.removePeripheral(this.state.selected);
        this.setState({selected:null});
    };

    handleExport = (event) =>{
        if(this.state.selected===null){
            alert("Please select a peripheral to Export");
            return;
        }
        let peripheral = {[this.state.selected]:this.peripherals[this.peripherals.findIndex(item => item.peripheral_name === this.state.selected)]};
        let blob = new Blob([JSON.stringify(peripheral, null, 4)], {type: "application/json"});
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
        this.props.server.creator_proxy.createPeripheral(JSON.parse(content), null);
    };

    handle_create = () =>{
        this.props.setSetting("edit_peripheral_mode", false);
        this.props.setSetting("edit_peripheral_name", null);
    };

    handleEdit = (content) => {
        this.props.setSetting("edit_peripheral_mode", true);
        this.props.setSetting("edit_peripheral_name", this.state.selected);
    };


    is_editable = (peripheral) =>{
        return this.state.selected !== null;
    };

    render(){
        return(
            <ManagerLayout>
                <ManagerButtonsLayout>
                    <LinkContainer to="/peripheral_creator">
                        <Button outline confirm onClick={this.handle_create}> Add new row</Button>
                    </LinkContainer>
                    <Button outline deny onClick={this.handleRemoveRow}> Remove Row</Button>
                    <Button outline onClick={this.handleImport}>Import peripheral</Button>
                    <Button outline onClick={this.handleExport}>Export peripheral</Button>
                    <LinkContainer isActive={this.is_editable} to="/peripheral_creator">
                        <Button outline onClick={this.handleEdit} >Edit peripheral</Button>
                    </LinkContainer>
                </ManagerButtonsLayout>
                <BlockLayout centered>
                    <DataTable
                        title='Peripherals'
                        data={this.peripherals}
                        columns={this.columns}
                        customStyles={TableStyle}
                        theme="uScopeTableTheme"
                        selectableRows
                        onSelectedRowsChange={this.handleOnSelect}
                    />
                </BlockLayout>
            </ManagerLayout>
        );
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(PeripheralsManager);
