import React, {Component} from "react";
import AceEditor from "react-ace";
import {Button} from "../../UI_elements"

import "ace-builds/src-min-noconflict/mode-javascript";
import "ace-builds/src-min-noconflict/theme-dracula";
import {connect} from "react-redux";
import styled from "styled-components";


function mapStateToProps(state) {
    return{
        settings:state.settings,
        scripts_store:state.scripts
    }
}

const ComponentLayout = styled.div`
  display: grid;
  grid-template-columns: auto;
  grid-auto-rows: auto;
  margin: 2rem;
  grid-gap: 2em;
`

const Title = styled.h1`
  margin-right: auto;
  margin-left: auto;
`

class ScriptsCreator extends Component {
    constructor(props) {
        super(props);
        this.state = {editor_content:""}
    }

    onChange = (newValue) => {
        debugger;
        this.setState({editor_content:newValue});
    };

    onSubmit = (event) => {
        let script = this.props.scripts_store.find(x => x.path === this.props.settings.scriptEditor_title);
        script.script_content = this.state.editor_content;
        this.props.settings.server.script_proxy.edit_script(script);
    };

    onLoad = (editor) => {
        let script = this.props.scripts_store.find(x => x.path === this.props.settings.scriptEditor_title);
        if(typeof script !== 'undefined' && script !== null){
            editor.setValue(script.script_content);
        }

    };

    render(){
        return(
            <ComponentLayout>
                <Title>{this.props.settings.scriptEditor_title}</Title>
                <AceEditor
                    mode="javascript"
                    theme="dracula"
                    width='auto'
                    showPrintMargin={false}
                    onChange={this.onChange}
                    onLoad={this.onLoad}
                    name="UNIQUE_ID_OF_DIV"
                    value={this.state.editor_content}
                    editorProps={{ $blockScrolling: true }}
                />
                <Button variant="success" onClick={this.onSubmit}>Submit</Button>
            </ComponentLayout>
        );
    };
}

export default connect(mapStateToProps)(ScriptsCreator);


