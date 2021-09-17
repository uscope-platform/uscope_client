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

import React from "react";
import {
    Button, FormLayout,
    InputField,
    SidebarBlockLayout,
    SidebarBlockTitleLayout
} from "../../UI_elements";
import {useSelector} from "react-redux";

let CaptureProperties = props =>{
    const settings = useSelector(state => state.settings);
    const channels = useSelector(state => state.plot);

    let handle_change = (event) =>{
    };

    let handle_close = (event) =>{
        let data = channels.data.map((ch)=>{
            return ch.y;
        });
        let csv_content = `time,${channels.data[0].name},${channels.data[1].name},${channels.data[2].name},${channels.data[3].name},${channels.data[4].name},${channels.data[5].name}\n`
        for(let i = 0; i<data[0].length; i++){

            csv_content += `${channels.data[0].x[i]/settings.sampling_period},${data[0][i]},${data[1][i]},${data[2][i]},${data[3][i]},${data[4][i]},${data[5][i]}\n`
        }

        let [month, day, year]    = new Date().toLocaleDateString("en-US").split("/");
        let [hour, minute, second] = new Date().toLocaleTimeString("en-US").split(/:| /);
        let filename = settings.default_ch_group.group_name.replace(' ', '_')+ '_'+ day+month+year+hour+minute+second;

        var encodedUri = encodeURI('data:text/csv;charset=utf-8,'+ csv_content);
        var link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", filename);
        link.setAttribute("id", "csv_download_link");
        document.body.appendChild(link);

        link.click();
        link.remove();

    };

    return(
        <SidebarBlockLayout padding={'1rem'}>
            <SidebarBlockTitleLayout>
                <label style={{fontSize:'20px',fontWeight:600}}>{"Capture Settings"}</label>
            </SidebarBlockTitleLayout>
            <FormLayout>
                <InputField inline name='n_buffers' onChange={handle_change} label="Number of buffers"/>
                <Button onClick={handle_close}>Submit changes</Button>
            </FormLayout>
        </SidebarBlockLayout>
    )
};

export default CaptureProperties;