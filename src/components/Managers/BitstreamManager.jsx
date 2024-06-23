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

import React, {useRef} from "react";
import {
    Button,
    FormLayout,
    InputField,
    SimpleContent,
    UIPanel
} from "../UI_elements";
import {useSelector} from "react-redux";
import {up_bitstream} from "../../client_core";
import {Responsive, WidthProvider} from "react-grid-layout";



let BitstreamManager = props =>{

    const inputFile = useRef(null)
    const ResponsiveGridLayout = WidthProvider(Responsive);

    const bitstreams_store = useSelector(state => state.bitstreams);
    const settings = useSelector(state => state.settings);

    let selected_bitstream = bitstreams_store[settings.selected_bitstream];
    let selected_bitstream_obj = new up_bitstream(selected_bitstream);


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

    if(selected_bitstream)
    return(
        <UIPanel key="bitstream_properties"  level="level_2">
            <SimpleContent name="Bitstream Properties" content={
                <FormLayout>
                    <InputField inline name='name' placeholder={selected_bitstream.name} onKeyDown={handle_change_name} label='name'/>
                    <Button onClick={handle_open_file_chooser}>Change Bitstream File</Button>
                    <input type='file' id='bitstream_chooser' ref={inputFile} onChange={upload_file} style={{display: 'none'}}/>
                </FormLayout>
            }/>
        </UIPanel>
    );

}

export default BitstreamManager;