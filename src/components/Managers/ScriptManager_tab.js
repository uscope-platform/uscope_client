import React, {Component}  from 'react';


import {connect} from "react-redux"

import DataTable from 'react-data-table-component';
import {TableStyle} from './TableStyles'


import Button from "../UI_elements/Button"
import {setSetting} from "../../redux/Actions/SettingsActions";
import {LinkContainer} from "react-router-bootstrap";
import BlockLayout from "../UI_elements/BlockLayout";
import ManagerLayout, {ManagerButtonsLayout} from "../UI_elements/ManagerLayout";



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



class ScriptManager extends Component {
    constructor(props) {
        super(props);
        this.state = { selected: null, removed_scripts:[]};
        // the json stringify/parse is used to do a deep copy of the redux store
        this.scripts = JSON.parse(JSON.stringify(this.props.scripts_store));

    }

    columns = [
        {
            selector: 'id',
            name: 'Script ID',
            sort: true
        },
        {
            selector: 'name',
            name: 'Script Name',
            sort: true,
            grow:2
        },
        {
            selector: 'path',
            name: 'Script Filename',
            grow:3
        },
        {
            selector: 'triggers',
            name: 'Script Triggers',
            grow:3
        }
    ];


    handleOnSelect = (selection) => {
        if(!selection.allSelected && selection.selectedCount===1){
            this.setState(() => ({
                selected: selection.selectedRows[0].id
            }));
        } else if(selection.selectedCount===0) {
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
            <ManagerLayout>
                <ManagerButtonsLayout>
                    <Button outline confirm onClick={this.handleAddRow}>+ Add new row</Button>
                    <Button outline deny onClick={this.handleRemoveRow}>- Remove Row</Button>
                    <LinkContainer isActive={this.is_editable} to="/script_creator">
                        <Button outline onClick={this.handleScriptEdit}>Edit Script</Button>
                    </LinkContainer>
                </ManagerButtonsLayout>
                <BlockLayout centered>
                    <DataTable
                        title='Scripts'
                        data={this.scripts}
                        columns={this.columns}
                        customStyles={TableStyle}
                        theme="uScopeTableTheme"
                        selectableRows
                        onSelectedRowsChange={this.handleOnSelect}
                    />
                </BlockLayout>
                <Button  outline confirm onClick={this.handleScriptConfigurationSave}>Save scripts configuration</Button>
            </ManagerLayout>
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
