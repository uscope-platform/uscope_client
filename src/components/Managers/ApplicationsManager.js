import React, {Component}  from 'react';


import { LinkContainer } from 'react-router-bootstrap'
import {connect} from "react-redux"

import BootstrapTable from 'react-bootstrap-table-next';
import cellEditFactory from 'react-bootstrap-table2-editor';
import paginationFactory from 'react-bootstrap-table2-paginator';

import {Button, Container, Row} from "react-bootstrap";



function mapStateToProps(state) {
    return{
        applications:state.applications
    }
}

class PeripheralsManager extends Component {
    constructor(props) {
        super(props);
        this.state = {selected:null};
        this.applications = Object.values(this.props.applications);
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
            dataField: 'peripheral_name',
            text: 'Peripheral Name',
            sort: true
        },
        {
            dataField: 'version',
            text: 'Peripheral Version'
        }
    ];


    handleOnSelect = (row, isSelect) => {
        if (isSelect) {
            this.setState(() => ({
                selected: row.peripheral_name
            }));
        } else {
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
        debugger;
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

    };

    render(){
        return(
            <Container>
                <Row>
                    <LinkContainer to="/peripheral_creator">
                        <Button variant="outline-success"> Add new row</Button>
                    </LinkContainer>
                    <Button variant="outline-danger" onClick={this.handleRemoveRow}> Remove Row</Button>
                    <Button variant="outline-primary" onClick={this.handleImport}>Import peripheral</Button>
                    <Button variant="outline-primary" onClick={this.handleExport}>Export peripheral</Button>
                </Row>
                <Row>
                    <BootstrapTable
                        keyField='peripheral_name'
                        data={this.peripherals}
                        columns={this.columns}
                        cellEdit={ cellEditFactory({
                            mode: 'click',
                            blurToSave: true
                        })}
                        pagination={ paginationFactory() }
                        selectRow={ this.selectRow }
                    />
                </Row>
            </Container>
        );
    };
}

export default connect(mapStateToProps)(PeripheralsManager);
