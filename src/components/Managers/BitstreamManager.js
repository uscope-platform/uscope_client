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

import React, {useRef, useState} from "react";
import {Button, ManagerButtonsLayout, ManagerLayout} from "../UI_elements";
import DataTable from "react-data-table-component";
import {TableStyle} from "./TableStyles";
import {useDispatch, useSelector} from "react-redux";
import {setSetting} from "../../redux/Actions/SettingsActions";
import {get_next_id, up_bitstream} from "../../client_core";

let columns = [
    {
        selector: row => row.id,
        name: 'Bitstream ID',
        sort: true
    },
    {
        selector: row => row.name,
        name: 'Bitstream Name',
        sort: true,
        grow:2
    }
];


let BitstreamManager = props =>{

    const inputFile = useRef(null)
    const bitstreams_store = useSelector(state => state.bitstreams);
    const settings = useSelector(state => state.settings);

    const [bitstream_object, set_bitstream_object] = useState({})

    const dispatch = useDispatch();

    const selected_bitstream = new up_bitstream(bitstreams_store[settings.selected_bitstream]);

    let handleOnSelect = (selection) => {
        if(selection.selectedCount===1){
            dispatch(setSetting(["selected_bitstream", selection.selectedRows[0].id]));
        } else if(selection.selectedCount===0) {
            dispatch(setSetting(["selected_bitstream", null]));
        }

    };

    let handleAddRow = () =>{

        let ids = Object.values(bitstreams_store).map(a => a.id).sort();
        let id = get_next_id(ids);
        set_bitstream_object({ id:id, name:'new_bitstream_'+id});
        inputFile.current.click();


    };

    let handleRemoveRow = (event) =>{

        dispatch(setSetting(["selected_bitstream", null]));
        up_bitstream.delete_bitstream(selected_bitstream).then();

    };

    let upload_file = (event) => {
        up_bitstream.get_file_content( inputFile).then((file =>{
            bitstream_object['content'] = file.content;
            bitstream_object['name'] = file.name.replace(".bit", "")
            let bitstream = new up_bitstream(bitstream_object);
            bitstream.add_remote().then();
        }));
    }



    const rowSelectCritera = row => row.id === settings.selected_bitstream;


    return(
    <ManagerLayout>
        <ManagerButtonsLayout>
            <Button style={{margin:"0 1rem"}} onClick={handleAddRow}>Add Bitstream</Button>
            <Button style={{margin:"0 1rem"}} onClick={handleRemoveRow}>Remove Bitstream</Button>
        </ManagerButtonsLayout>
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
        <input type='file' id='bitstream_chooser' ref={inputFile} onChange={upload_file} style={{display: 'none'}}/>
    </ManagerLayout>
    );
};


export default BitstreamManager;
