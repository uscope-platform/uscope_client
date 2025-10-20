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
    SimpleContent,
    UIPanel
} from "#UI/index.js";
import {up_bitstream, upload_raw} from "#client_core/index.js";
import BitstreamSidebar from "./BitstreamSidebar.js";
import type {bitstream_model} from "#interfaces/index.js";

interface BitstreamManagerProps {}

let BitstreamManager = (props: BitstreamManagerProps) =>{

    const inputFile = useRef(null)

    const [sel_bit, set_sel_bit] = useState(up_bitstream.construct_empty(9999));


    let handle_select = (bit: bitstream_model)=>{
        set_sel_bit(new up_bitstream(bit));
    };

    let upload_file = (event: React.ChangeEvent<HTMLInputElement>) => {

        up_bitstream.get_file_content( inputFile).then((file_content =>{
            sel_bit.edit_field("content" as keyof bitstream_model, file_content.content)
        }));
    }

    let handle_change_name = (event: React.KeyboardEvent<HTMLInputElement>) =>{
        if(event.key==="Enter"|| event.key ==="Tab"){
            sel_bit.edit_field(event.currentTarget.name as keyof bitstream_model, event.currentTarget.value);
        }
    }


    let handle_open_file_chooser = async () =>{

        let event = await upload_raw();
        let file: {content: string, name: string} = await  up_bitstream.get_file_content( event);

        const decoder = new TextDecoder('utf-8');
        let edit_obj = {name:file.name, content:file.content};
        sel_bit.update_file(edit_obj);

    }



    return(
        <div style={{
            display:"flex",
            flexDirection:"row",
            gap:10,
            height:"100%"
        }}>
            <UIPanel key="bitstream_properties" style={{flexGrow:1}} level="level_2">
                <SimpleContent name="Bitstream Properties">
                    <FormLayout>
                        <InputField inline name='name' placeholder={sel_bit.name} onKeyDown={handle_change_name} label='name'/>
                        <Button onClick={handle_open_file_chooser}>Change Bitstream File</Button>
                        <input type='file' id='bitstream_chooser' ref={inputFile} onChange={upload_file} style={{display: 'none'}}/>
                    </FormLayout>
                </SimpleContent>
            </UIPanel>
            <BitstreamSidebar  bitstream={sel_bit} on_select={handle_select}/>
        </div>
    );

}

export default BitstreamManager;