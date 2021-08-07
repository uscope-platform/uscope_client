import React, {useState} from "react";
import {BlockLayout, Button, ManagerButtonsLayout, ManagerLayout} from "../UI_elements";
import DataTable from "react-data-table-component";
import {TableStyle} from "./TableStyles";
import {useDispatch, useSelector} from "react-redux";
import {setSetting} from "../../redux/Actions/SettingsActions";
import ProgramsEditor from "../Editors/Programs/ProgramsEditor";

let columns = [
    {
        selector: 'id',
        name: 'Bitstream ID',
        sort: true
    },
    {
        selector: 'name',
        name: 'Bitstream Name',
        sort: true,
        grow:2
    }
];


let BitstreamManager = props =>{
    const bitstreams_store = useSelector(state => state.bitstreams);
    const settings = useSelector(state => state.settings);

    const dispatch = useDispatch();

    let handleOnSelect = (selection) => {
        if(selection.selectedCount===1){
            dispatch(setSetting(["selected_bitstream", selection.selectedRows[0].id]));
        } else if(selection.selectedCount===0) {
            dispatch(setSetting(["selected_bitstream", null]));
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
        return id;
    }

    let handleAddRow = () =>{

        let ids = Object.values(bitstreams_store).map(a => a.id).sort();
        let id = get_next_id(ids);
        let new_bitstream= { id:id, name:'new_bitstream_'+id};
        settings.server.bitstream_proxy.upload_bitstream(new_bitstream);

    };

    let handleRemoveRow = (event) =>{

    let removed = Object.values(bitstreams_store).find(x => x.id === settings.selected_bitstream);
    settings.server.bitstream_proxy.delete_bitstream(removed)
    dispatch(setSetting(["selected_bitstream", null]));

    };


    const rowSelectCritera = row => row.id === settings.selected_bitstream;


    return(
    <ManagerLayout>
        <ManagerButtonsLayout>
            <Button style={{margin:"0 1rem"}} onClick={handleAddRow}>Add Bitstream</Button>
            <Button style={{margin:"0 1rem"}} onClick={handleRemoveRow}>Remove Bitstream</Button>
        </ManagerButtonsLayout>
        <BlockLayout centered>
            <DataTable
                title='Bitstreams'
                data={Object.values(bitstreams_store)}
                columns={columns}
                customStyles={TableStyle}
                theme="uScopeTableTheme"
                selectableRows
                onSelectedRowsChange={handleOnSelect}
                selectableRowSelected={rowSelectCritera}
            />
        </BlockLayout>
    </ManagerLayout>
    );
};


export default BitstreamManager;
