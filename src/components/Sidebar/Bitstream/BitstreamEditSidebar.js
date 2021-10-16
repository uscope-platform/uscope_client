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
    SidebarBlockLayout,
    SidebarBlockTitleLayout
} from "../../UI_elements";
import {useSelector} from "react-redux";
import {BitstreamProperties} from "../../UI_elements/SidebarComponents/BitstreamProperties";
import {handle_file_chosen} from "../../../utilities/BitstreamUtilities";




let BitstreamEditSidebar = props =>{
    const inputFile = useRef(null)
    const settings = useSelector(state => state.settings);
    const bitstreams = useSelector(state => state.bitstreams);


    let upload_file = (event) => {
        handle_file_chosen( inputFile).then((file_content =>{
            let  edit = {id:props.selected_bitstream, field:{name:"file_content", value:file_content}}
            settings.server.bitstream_proxy.edit_bitstream(edit);
        }));
    }
    let handle_open_file_chooser = (event) =>{
        inputFile.current.click();
    }

    return(
        <SidebarBlockLayout padding={'1rem'}>
            <SidebarBlockTitleLayout>
                <label style={{fontSize:'20px',fontWeight:600}}>{"Bitstreams"}</label>
            </SidebarBlockTitleLayout>
            <FormLayout>
                <BitstreamProperties server={settings.server}  bitstream={props.selected_bitstream} field_name='name' field_value={bitstreams[props.selected_bitstream].name}/>
                <Button onClick={handle_open_file_chooser}>Change Bitstream File</Button>
            </FormLayout>
            <input type='file' id='bitstream_chooser' ref={inputFile} onChange={upload_file} style={{display: 'none'}}/>
        </SidebarBlockLayout>
    )
};

export default BitstreamEditSidebar;