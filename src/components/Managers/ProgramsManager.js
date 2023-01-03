// Copyright 2021 University of Nottingham Ningbo China
// Author: Filippo Savi <filssavi@gmail.com>
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import React, {useState} from "react";
import {Button, ManagerButtonsLayout, ManagerLayout} from "../UI_elements";
import DataTable from "react-data-table-component";
import {TableStyle} from "./TableStyles";
import {useDispatch, useSelector} from "react-redux";
import {setSetting} from "../../redux/Actions/SettingsActions";
import ProgramsEditor from "../Editors/Programs/ProgramsEditor";
import ButterToast, { POS_TOP, POS_RIGHT, Cinnamon} from "butter-toast";
import {get_next_id, up_program} from "../../client_core";

let columns = [
    {
        selector: row => row.id,
        name: 'Program ID',
        sort: true
    },
    {
        selector: row => row.name,
        name: 'Program Name',
        sort: true,
        grow:2
    },
    {
        selector: row => row.program_type,
        name: 'Program Type',
        sort: true,
    },
];


const compile_status_position = {
    vertical: POS_TOP,
    horizontal: POS_RIGHT
};

let ProgramsManager = props =>{
    const programs_store = useSelector(state => state.programs);
    const settings = useSelector(state => state.settings);

    const [editor_open, set_editor_open] = useState(false);

    const dispatch = useDispatch();

    const selected_program = new up_program(programs_store[settings.selected_program]);

    let handleOnSelect = (selection) => {
        if(selection.selectedCount===1){
            dispatch(setSetting(["selected_program", selection.selectedRows[0].id]));
        } else if(selection.selectedCount===0) {
            dispatch(setSetting(["selected_program", null]));
        }

    };

    let handleAddRow = () =>{
        let id = get_next_id(Object.values(programs_store).map(a => a.id).sort());
        let program = up_program.construct_empty(id);
        program.add_remote().then();
    };

    let handleRemoveRow = (event) =>{
        dispatch(setSetting(["selected_program", null]));
        up_program.delete_program(selected_program).then();
    };

    let handleScriptEdit = () => {

        if(settings.selected_program===null){
            alert("Please select a script to edit");
            return;
        }
        set_editor_open(true);
    };

    let handle_edit_done = () =>{
        set_editor_open(false);
    }

    let handle_compile = () =>{

        if(settings.selected_program===null){
            alert("Please select a script to compile");
            return;
        }

        selected_program.compile().then((data)=>{
            let notifications={passed:[],failed:[]};
            for (let item of data){
                if(item.status==="passed"){
                    notifications.passed.push(
                        ButterToast.raise({
                            content: <Cinnamon.Crisp title={item.file}
                                                     content="Compilation was successful"
                                                     scheme={Cinnamon.Crisp.SCHEME_GREEN}/>
                        })
                    )
                } else if (item.status==="failed"){
                    notifications.failed.push(
                        ButterToast.raise({
                            content: <Cinnamon.Crisp title={item.file}
                                                     content={item.error}
                                                     scheme={Cinnamon.Crisp.SCHEME_RED}/>
                        })
                    )
                }
            }
            window.setTimeout(()=>{
                for(let notif of notifications.passed){
                    ButterToast.dismiss(notif);
                }
            },3000);

        });

    }

    let handle_apply_program = () =>{
        let core_address = '0x83c00000';
        selected_program.load(core_address).then();
    };


    if(editor_open) {
    return (
        <ManagerLayout>
            <ProgramsEditor program={selected_program} done={handle_edit_done} />
        </ManagerLayout>
    );
    }

    const rowSelectCritera = row => row.id === settings.selected_program;


    return(
    <ManagerLayout>
        <ButterToast
            position={compile_status_position}
        />
        <ManagerButtonsLayout>
            <Button style={{margin:"0 1rem"}} onClick={handleAddRow}>Add Program</Button>
            <Button style={{margin:"0 1rem"}} onClick={handleRemoveRow}>Remove Program</Button>
            <Button style={{margin:"0 1rem"}} onClick={handleScriptEdit}>Edit Program</Button>
            <Button style={{margin:"0 1rem"}} onClick={handle_compile}>Compile Program</Button>
            <Button style={{margin:"0 1rem"}} onClick={handle_apply_program}>Load Program</Button>
        </ManagerButtonsLayout>
        <DataTable
            title='Programs'
            data={Object.values(programs_store)}
            columns={columns}
            customStyles={TableStyle}
            theme="uScopeTableTheme"
            selectableRows
            onSelectedRowsChange={handleOnSelect}
            selectableRowSelected={rowSelectCritera}
        />
    </ManagerLayout>
    );
};


export default ProgramsManager;
