import React, {useState, useEffect, useRef} from "react";
import AceEditor from "react-ace";
import {Button} from "../../UI_elements"

import "ace-builds/src-min-noconflict/mode-javascript";
import "ace-builds/src-min-noconflict/theme-dracula";
import {useSelector} from "react-redux";
import styled from "styled-components";
import fCoreMode from "./fCorehas";



const Title = styled.h1`
  margin-right: auto;
  margin-left: auto;
`
const Editor = styled(AceEditor)`
    * {
        font-family: inherit;
    }
`;
let ProgramsEditor = props =>{
    const aceEditor = useRef(null)
    const programs = useSelector(state => state.programs);
    const settings = useSelector(state => state.settings);
    const [editor_content, set_editor_content] = useState("");

    useEffect(()=>{
        if (aceEditor.current) {
            aceEditor.current.editor.getSession().setMode(new fCoreMode());

        }

    },[])

    let handle_change = (newValue) => {
        set_editor_content(newValue);
    };

    let handle_submit = (event) => {
        let prog = Object.values(programs).find(x => x.path === settings.program_editor_title);
        prog = {program:prog.id, field:'program_content', value:editor_content}

        settings.server.prog_proxy.edit_program(prog);
        props.done();
    };

    let handle_load = (editor) => {

        let prog =Object.values(programs).find(x => x.path === settings.program_editor_title);
        if(typeof prog !== 'undefined' && prog !== null){
            editor.setValue(prog.program_content);
            set_editor_content(prog.program_content);
        }

    };

    return(
        <>
            <Title>{settings.program_editor_title}</Title>
            <Editor
                ref={aceEditor}
                mode="text"
                width='auto'
                theme="dracula"
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

export default ProgramsEditor;