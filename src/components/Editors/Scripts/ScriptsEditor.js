import React, {useState} from "react";
import AceEditor from "react-ace";
import {Button} from "../../UI_elements"

import "ace-builds/src-min-noconflict/mode-javascript";
import "ace-builds/src-min-noconflict/theme-dracula";
import {useSelector} from "react-redux";
import styled from "styled-components";

const Title = styled.h1`
  margin-right: auto;
  margin-left: auto;
`
const Editor = styled(AceEditor)`
    * {
        font-family: inherit;
    }
`;
let ScriptsEditor = props =>{
    const scripts_store = useSelector(state => state.scripts);
    const settings = useSelector(state => state.settings);
    const [editor_content, set_editor_content] = useState("");

    let handle_change = (newValue) => {
        set_editor_content(newValue);
    };

    let handle_submit = (event) => {
        let script = Object.values(scripts_store).find(x => x.path === settings.script_editor_title);
        script = {script:script.id, field:'script_content', value:editor_content}

        settings.server.script_proxy.edit_script(script);
        props.done();
    };

    let handle_load = (editor) => {
        let script =Object.values(scripts_store).find(x => x.path === settings.script_editor_title);
        if(typeof script !== 'undefined' && script !== null){
            editor.setValue(script.script_content);
            set_editor_content(script.script_content);
        }
    };

    return(
        <>
            <Title>{settings.script_editor_title}</Title>
            <Editor
                mode="javascript"
                theme="dracula"
                width='auto'
                showPrintMargin={false}
                onChange={handle_change}
                onLoad={handle_load}
                name="UNIQUE_ID_OF_DIV"
                value={editor_content}
                editorProps={{ $blockScrolling: true }}
            />
            <Button variant="success" onClick={handle_submit}>Submit</Button>
        </>
    );


}

export default ScriptsEditor;

