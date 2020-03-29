import React, {Component} from "react";
import AceEditor from "react-ace";
import {Container, Row, Col, Button, Jumbotron} from "react-bootstrap";

import "ace-builds/src-min-noconflict/mode-javascript";
import "ace-builds/src-min-noconflict/theme-dracula";
import {connect} from "react-redux";


function mapStateToProps(state) {
    return{
        settings:state.settings,
        scripts_store:state.scripts
    }
}

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
        this.props.server.script_proxy.edit_script(script);
    };

    onLoad = (editor) => {
        let script = this.props.scripts_store.find(x => x.path === this.props.settings.scriptEditor_title);
        if(typeof script !== 'undefined' && script !== null){
            editor.setValue(script.script_content);
        }

    };

    render(){
        return(
            <Container fluid>
                <Row>
                    <Col style={{display: 'flex', justifyContent: 'center'}}>
                        <Jumbotron style={{marginTop: '1em', marginBottom:'1em', padding:'0.5em'}}>
                            <h1 style={{margin: '0'}}>
                                {this.props.settings.scriptEditor_title}
                            </h1>
                        </Jumbotron>
                    </Col>

                </Row>
                <Row>
                    <Col>
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
                    </Col>
                </Row>
                <Row>
                    <Col md={{ span: 6, offset: 9 }}>
                        <Button variant="success" onClick={this.onSubmit}>
                            Submit
                        </Button>
                    </Col>
                </Row>
            </Container>
        );
    };
}

export default connect(mapStateToProps)(ScriptsCreator);


