import React, {Component}  from 'react';


import {connect} from "react-redux"

import BootstrapTable from 'react-bootstrap-table-next';
import cellEditFactory from 'react-bootstrap-table2-editor';
import paginationFactory from 'react-bootstrap-table2-paginator';

import {Button, Col, Container, Row} from "react-bootstrap";
import {setSetting} from "../../redux/Actions/SettingsActions";
import {LinkContainer} from "react-router-bootstrap";



function mapStateToProps(state) {
    return{
        modals:state.modals,
        scripts_store:state.scripts
    }
}


const mapDispatchToProps = dispatch => {
    return{
        setSetting: (name, value) => {dispatch(setSetting([name, value]))},
    }
};

const defaultSorted = [{
    dataField: 'id',
    order: 'asc'
}];

const expandRow = {
    renderer: row => {
        return(
            <div>
                <p>{row.script_content}</p>
            </div>
        )
    },
    onlyOneExpanding: true,
    showExpandColumn: true,
    expandColumnPosition: 'right'
};

class ScriptManager extends Component {
    constructor(props) {
        super(props);
        this.state = { selected: null, removed_scripts:[]};
        // the json stringify/parse is used to do a deep copy of the redux store
        this.scripts = JSON.parse(JSON.stringify(this.props.scripts_store));

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
            dataField: 'id',
            text: 'Script ID',
            sort: true
        },
        {
            dataField: 'name',
            text: 'Script Name',
            sort: true
        },
        {
            dataField: 'path',
            text: 'Script Filename',
            editorRenderer: (editorProps, value, row, column, rowIndex, columnIndex) => (
                <FileChoice { ...editorProps } value={ value } row={row} column={column} updateContent={(content)=>{row.script_content=content}}/>)
        },
        {
            dataField: 'triggers',
            text: 'Script Triggers'
        }
    ];


    handleOnSelect = (row, isSelect) => {
        if (isSelect) {
            this.setState(() => ({
                selected: row.id
            }));
        } else {
            this.setState(() => ({
                selected: null
            }));
        }
    };

    handleAddRow = () =>{
        let id = null;
        for(let i=1;i<=this.scripts.length;i++){
            if(this.scripts[i-1].id !== i){
                id = i;
                break;
            }
        }
        if(id===null){
            id = this.scripts.length+1;
        }

        this.scripts.push({
            id:id,
            name:'new script',
            path:'',
            triggers:''
        });
        //The state modification is not needed in this case, it is only used to trigger the table's reload
        this.setState({selected:this.state.selected});
    };

    handleRemoveRow = (event) =>{
        let removed = this.scripts.find(x => x.id === this.state.selected);
        this.scripts.splice(this.scripts.findIndex(item => item.id === this.state.selected), 1);
        this.setState(() => ({
            removed_scripts: [...this.state.removed_scripts, ...[removed]]
        }));
        this.setState({selected:null});
    };

    handleScriptConfigurationSave = () =>{
        //HANDLE ADDITIONS
        let difference = this.scripts.filter((element) => {
            let presence = this.props.scripts_store.filter((curr_obj) => {
                    return JSON.stringify(curr_obj) === JSON.stringify(element)
            });
            return !(presence && presence.length);
        });

        // eslint-disable-next-line
        for(let script of difference){
            this.props.server.script_proxy.upload_script(script);
        }
        //HANDLE DELETIONS
        // eslint-disable-next-line
        for(let script of this.state.removed_scripts){
            this.props.server.script_proxy.delete_script(script);
        }
    };

    handleScriptEdit = () => {
        let script = this.scripts.find(x => x.id === this.state.selected);
        this.props.setSetting("scriptEditor_title", script.path);
    };

    render(){
        return(
            <Container>
                <Row>
                    <Button variant="outline-success" onClick={this.handleAddRow}>+ Add new row</Button>
                    <Button variant="outline-danger" onClick={this.handleRemoveRow}>- Remove Row</Button>
                    <LinkContainer isActive={this.is_editable} to="/script_creator">
                        <Button variant="outline-primary" onClick={this.handleScriptEdit}>Edit Script</Button>
                    </LinkContainer>
                </Row>
                <Row>
                    <BootstrapTable
                        keyField='id'
                        data={this.scripts}
                        columns={this.columns}
                        expandRow={ expandRow }
                        cellEdit={ cellEditFactory({
                            mode: 'click',
                            blurToSave: true
                        })}
                        defaultSorted={defaultSorted}
                        pagination={ paginationFactory() }
                        selectRow={ this.selectRow }
                    />
                </Row>
                <Row>
                    <Col md={{ offset: 9 }}>
                        <Button  variant="outline-success" onClick={this.handleScriptConfigurationSave}>Save scripts configuration</Button>
                    </Col>
                </Row>
            </Container>
        );
    };
}


class FileChoice extends React.Component {

    componentDidMount(){
        this.fileSelector = document.createElement('input');
        this.fileSelector.setAttribute('type', 'file');
        this.fileSelector.addEventListener('change', this.handleChange)
    }

    handleChange = (e) => {
        e.preventDefault();
        this.chosenFile = e.target.files[0];
        this.readFile(this.chosenFile).then((content)=>{
            this.props.updateContent(content[0]);
            this.filename = content[1];
            this.props.onUpdate(content[1])
        });

    };

    handleFileSelect = (e) => {
        e.preventDefault();
        this.fileSelector.click();
    };

    readFile = inputFile => {
        const temporaryFileReader = new FileReader();
        let filename = inputFile.name;
        return new Promise((resolve, reject) => {
            temporaryFileReader.onload = () => {
                resolve([temporaryFileReader.result, filename]);
            };
            temporaryFileReader.readAsText(inputFile);
        });

    };

     getValue() {
         return this.filename;
    }

    render() {
        return [
            // eslint-disable-next-line
            <a href="" onClick={this.handleFileSelect}>Select files</a>
        ];
    }
}



export default connect(mapStateToProps,mapDispatchToProps)(ScriptManager);
