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
import {
    Button,
    FormLayout,
    InputField,
    ManagerButtonsLayout,
    ManagerLayout,
    SimpleContent,
    UIPanel
} from "../UI_elements";
import DataTable from "react-data-table-component";
import {TableStyle} from "./TableStyles";
import {useDispatch, useSelector} from "react-redux";
import {setSetting} from "../../redux/Actions/SettingsActions";
import {get_next_id, up_bitstream} from "../../client_core";
import {Responsive, WidthProvider} from "react-grid-layout";

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
    const ResponsiveGridLayout = WidthProvider(Responsive);


    const bitstream_store = useSelector(state => state.bitstreams);
    const settings = useSelector(state => state.settings);

    let selected_bitstreams = Object.values(bitstream_store).filter((bitstream)=>{
        return bitstream.name === settings.selected_bitstream;
    });
    
    let selected_bitstream = null;

    if(selected_bitstreams && selected_bitstreams.length===1) {
        selected_bitstream = new up_bitstream(selected_bitstreams[0]);

        let selected_bitstream_obj = new up_bitstream(selected_bitstream)
        let upload_file = (event) => {
            up_bitstream.get_file_content( inputFile).then((file_content =>{
                selected_bitstream_obj.edit_field("file_content", file_content.content)
            }));
        }

        let handle_change_name = (event) =>{
            if(event.key==="Enter"|| event.key ==="Tab"){
                selected_bitstream_obj.edit_field(event.target.name, event.target.value);
            }
        }


        let handle_open_file_chooser = (event) =>{
            inputFile.current.click();
        }


        return(
            <ResponsiveGridLayout
                className="layout"
                breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                cols={{ lg: 24, md: 20, sm: 12, xs: 8, xxs: 4 }}
                rowHeight={30}
                useCSSTransforms={false}
            >
                <UIPanel key="bitstream_properties" data-grid={{x: 2, y: 0, w: 24, h: 5, static: true}} level="level_2">
                    <SimpleContent name="Bitstream Properties" content={
                        <FormLayout>
                            <InputField inline name='name' placeholder={selected_bitstream.name} onKeyDown={handle_change_name} label='name'/>
                            <Button onClick={handle_open_file_chooser}>Change Bitstream File</Button>
                            <input type='file' id='bitstream_chooser' ref={inputFile} onChange={upload_file} style={{display: 'none'}}/>
                        </FormLayout>
                    }/>
                </UIPanel>
            </ResponsiveGridLayout>
        );
    }



};

export default BitstreamManager;