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
    FormLayout, InputField,
} from "../../UI_elements";
import {up_bitstream} from "../../../client_core";




let BitstreamEditSidebar = props =>{
    const inputFile = useRef(null)

    let upload_file = (event) => {
        up_bitstream.get_file_content( inputFile).then((file_content =>{
            props.selected_bitstream.edit_field("file_content", file_content.content)
        }));
    }

    let handle_change_name = (event) =>{
        if(event.key==="Enter"|| event.key ==="Tab"){
            props.selected_bitstream.edit_field(event.target.name, event.target.value);
        }
    }
    let handle_open_file_chooser = (event) =>{
        inputFile.current.click();
    }

    return(
            <FormLayout>
                <InputField inline name='name' placeholder={props.selected_bitstream.name} onKeyDown={handle_change_name} label='name'/>
                <Button onClick={handle_open_file_chooser}>Change Bitstream File</Button>
                <input type='file' id='bitstream_chooser' ref={inputFile} onChange={upload_file} style={{display: 'none'}}/>
            </FormLayout>
    )
};

export default BitstreamEditSidebar;