import React, {useState} from "react";
import {BlockLayout, Button, ManagerButtonsLayout, ManagerLayout} from "../UI_elements";
import DataTable from "react-data-table-component";
import {TableStyle} from "./TableStyles";
import {useDispatch, useSelector} from "react-redux";
import {setSetting} from "../../redux/Actions/SettingsActions";
import ProgramsEditor from "../Editors/Programs/ProgramsEditor";
import ButterToast, { POS_TOP, POS_RIGHT, Cinnamon} from "butter-toast";

let columns = [
    {
        selector: 'id',
        name: 'Program ID',
        sort: true
    },
    {
        selector: 'name',
        name: 'Program Name',
        sort: true,
        grow:2
    },
    {
        selector: 'program_type',
        name: 'Program Type',
        sort: true,
    },
    {
        selector: 'path',
        name: 'Program Filename',
        grow:3
    }
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

    let handleOnSelect = (selection) => {
        if(selection.selectedCount===1){
            dispatch(setSetting(["selected_program", selection.selectedRows[0].id]));
        } else if(selection.selectedCount===0) {
            dispatch(setSetting(["selected_program", null]));
        }

    };

    let get_next_id =(ids) => {
        let id = null;
        if(ids.length === 0) return 1;
        for(var i = 1; i < ids.length; i++) {
            if(ids[i] - ids[i-1] !== 1) {
                id = ids[i-1]+1;
            }
        }
        if(id===null)
            id = ids.length+1;

    }

    let handleAddRow = () =>{

        let ids = Object.values(programs_store).map(a => a.id).sort();
        let id = get_next_id(ids);
        let new_program= { id:id, name:'new program_'+id, path:`new program_${id}.s`, program_content:'', program_type:''};
        settings.server.prog_proxy.upload_program(new_program);

    };

    let handleRemoveRow = (event) =>{

    let removed = Object.values(programs_store).find(x => x.id === settings.selected_program);
    settings.server.prog_proxy.delete_program(removed);
    dispatch(setSetting(["selected_program", null]));

    };

    let handleScriptEdit = () => {

        if(settings.selected_program===null){
            alert("Please select a script to edit");
            return;
        }

        let program = Object.values(programs_store).find(x => x.id === settings.selected_program);
        set_editor_open(true);
        dispatch(setSetting(["program_editor_title", program.path]));


};

let handle_edit_done = () =>{
    set_editor_open(false);
}

let handle_compile = () =>{

    if(settings.selected_program===null){
        alert("Please select a script to compile");
        return;
    }

    settings.server.prog_proxy.compile_program(programs_store[settings.selected_program]).then((data)=>{
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

if(editor_open) {
return (
    <ManagerLayout>
        <ProgramsEditor done={handle_edit_done} />
    </ManagerLayout>
);
}



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
    </ManagerButtonsLayout>
    <BlockLayout centered>
        <DataTable
            title='Programs'
            data={Object.values(programs_store)}
            columns={columns}
            customStyles={TableStyle}
            theme="uScopeTableTheme"
            selectableRows
            onSelectedRowsChange={handleOnSelect}
        />
    </BlockLayout>
</ManagerLayout>
);
};


export default ProgramsManager;
