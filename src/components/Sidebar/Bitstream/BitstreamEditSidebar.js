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
    FormLayout, InputField, SimpleContent, UIPanel,
} from "../../UI_elements";
import {up_bitstream} from "../../../client_core";
import {Responsive, WidthProvider} from "react-grid-layout";




let BitstreamEditSidebar = props =>{
    const inputFile = useRef(null)
    const ResponsiveGridLayout = WidthProvider(Responsive);

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
        <ResponsiveGridLayout
            className="layout"
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
            cols={{ lg: 24, md: 20, sm: 12, xs: 8, xxs: 4 }}
            rowHeight={30}
        >
            <UIPanel key="bitstream_properties" data-grid={{x: 2, y: 0, w: 24, h: 5}} level="level_2">
                <SimpleContent name="Bitstream Properties" content={
                    <FormLayout>
                        <InputField inline name='name' placeholder={props.selected_bitstream.name} onKeyDown={handle_change_name} label='name'/>
                        <Button onClick={handle_open_file_chooser}>Change Bitstream File</Button>
                        <input type='file' id='bitstream_chooser' ref={inputFile} onChange={upload_file} style={{display: 'none'}}/>
                    </FormLayout>
                }/>
            </UIPanel>
        </ResponsiveGridLayout>

    )
};

export default BitstreamEditSidebar;