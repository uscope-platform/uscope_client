import React, {Component}  from 'react';


import { LinkContainer } from 'react-router-bootstrap'
import {connect} from "react-redux"

import BootstrapTable from 'react-bootstrap-table-next';
import cellEditFactory from 'react-bootstrap-table2-editor';
import paginationFactory from 'react-bootstrap-table2-paginator';

import {Button, Container, Row} from "react-bootstrap";



function mapStateToProps(state) {
    return{
        peripherals:state.peripherals
    }
}

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


    render(){
        return(
            <Container>
                <Row>
                    <LinkContainer to="/peripheral_creator">
                        <Button variant="outline-success">+ Add new row</Button>
                    </LinkContainer>
                    <Button variant="outline-danger" onClick={this.handleRemoveRow}>- Remove Row</Button>
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
