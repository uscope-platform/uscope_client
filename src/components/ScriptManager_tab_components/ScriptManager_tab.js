import React, {Component}  from 'react';


import {saveScripts} from "../../redux/Actions/scriptsActions";
import {connect} from "react-redux"

import BootstrapTable from 'react-bootstrap-table-next';
import cellEditFactory from 'react-bootstrap-table2-editor';
import paginationFactory from 'react-bootstrap-table2-paginator';

import {Button, Col, Container, Row} from "react-bootstrap";



function mapStateToProps(state) {
    return{
        modals:state.modals,
        scripts_store:state.scripts
    }
}

const mapDispatchToProps = dispatch => {
    return{
        saveScripts: (script) => {dispatch(saveScripts(script))},
    }
};


const expandRow = {
    renderer: row => {
        return(
            <div>
                <p>{row.script_content}</p>
            </div>
        )
    },
    showExpandColumn: true,
    expandByColumnOnly: true
};

class ScriptManager extends Component {
    constructor(props) {
        super(props);
        this.state= {last_id:0};
        this.scripts = JSON.parse(JSON.stringify(this.props.scripts_store));
        this.scripts.map((script)=>{
            if(parseInt(script.id)>this.state.last_id){
               this.state.last_id = script.id;
            }
            return(null);
        });

    }


    columns = [{
        dataField: 'id',
        text: 'Script ID'
    }, {
        dataField: 'name',
        text: 'Script Name'
    }, {
        dataField: 'path',
        text: 'Script Filename',
        editorRenderer: (editorProps, value, row, column, rowIndex, columnIndex) => (
            <FileChoice { ...editorProps } value={ value } row={row} column={column} updateContent={(content)=>{row.script_content=content}}/>)
    }, {
        dataField: 'triggers',
        text: 'Script Triggers'
    }];


    handleAddRow = () =>{

        this.scripts.push({
            id:this.state.last_id+1,
            name:'',
            path:'',
            triggers:''
        });
        this.setState({last_id:this.state.last_id+1});
    };

    handleRemoveRow = (event) =>{
        this.scripts.pop();
        this.setState({last_id:this.state.last_id-1});
    };

    handleScriptConfigurationSave = () =>{
        this.props.saveScripts(this.scripts);
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
                        keyField='id'
                        data={this.scripts}
                        columns={this.columns}
                        expandRow={ expandRow }
                        cellEdit={ cellEditFactory({
                            mode: 'click',
                            blurToSave: true
                        })}
                        pagination={ paginationFactory() }
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



export default connect(mapStateToProps, mapDispatchToProps)(ScriptManager);