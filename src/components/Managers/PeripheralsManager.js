import React, {Component}  from 'react';


import {saveScripts} from "../../redux/Actions/scriptsActions";
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

const mapDispatchToProps = dispatch => {
    return{
        saveScripts: (script) => {dispatch(saveScripts(script))},
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

    handleAddRow = () =>{

    };

    handleRemoveRow = (event) =>{
        this.peripherals.splice(this.peripherals.findIndex(item => item.peripheral_name === this.state.selected), 1);
        this.setState({selected:null});
    };


    render(){
        return(
            <Container>
                <Row>
                    <Button variant="outline-success" onClick={this.handleAddRow}>+ Add new row</Button>
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

export default connect(mapStateToProps, mapDispatchToProps)(PeripheralsManager);
