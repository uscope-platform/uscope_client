import React, {useState} from "react";
import AceEditor from "react-ace";
import {Button} from "../UI_elements"

import "ace-builds/src-min-noconflict/mode-javascript";
import "ace-builds/src-min-noconflict/theme-dracula";
import {useSelector} from "react-redux";
import styled from "styled-components";

const Title = styled.h1`
  margin-right: auto;
  margin-left: auto;
`



let ScriptsEditor = props =>{
    const scripts_store = useSelector(state => state.scripts);
    const settings = useSelector(state => state.settings);
    const [editor_content, set_editor_content] = useState("");

    let handle_change = (newValue) => {
        set_editor_content(newValue);
    };

    let handle_submit = (event) => {
        let script = scripts_store.find(x => x.path === settings.scriptEditor_title);
        script.script_content = editor_content;
        settings.server.script_proxy.edit_script(script);
        props.done();
    };

    let handle_load = (editor) => {
        let script =scripts_store.find(x => x.path === settings.scriptEditor_title);
        if(typeof script !== 'undefined' && script !== null){
            editor.setValue(script.script_content);
            set_editor_content(script.script_content);
        }


    };

    return(
        <>
            <Title>{settings.scriptEditor_title}</Title>
            <AceEditor
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


