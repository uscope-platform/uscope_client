// Copyright 2024 Filippo Savi
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


import React from 'react';
import {SelectableList, SimpleContent, UIPanel} from "../../../UI_elements/index.jsx";

let  IoViewer = props =>{



    const data = props.io.values.map(val=>{
        if(props.vis_type === "float"){
            let v = new DataView(new ArrayBuffer(4));
            v.setUint32(0, val);
            return v.getFloat32(0);
        } else {
            return val;
        }
    })


    return (
        <UIPanel key="io_viewer" style={{minHeight:"200px"}} level="level_2">
            <SimpleContent name={"IO Viewer"} content={[
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gridColumnGap: "1em",
                }}>
                    <div>
                        <SelectableList
                        />
                    </div>
                    <div>
                        <SelectableList
                            items={data}
                        />
                    </div>
                </div>
            ]}/>
        </UIPanel>
    );
};

export default IoViewer;
