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


import React, {useEffect, useState} from 'react';
import {SelectableList, SimpleContent, UIPanel} from "#UI/index.js";

interface MemoryViewerProps {
    memory: number[],
    vis_type: string,
}

let  MemoryViewer = (props : MemoryViewerProps) =>{

    const addresses = Array.from(Array(64).keys()).map(val=>val.toString());

    let [data, set_data] = useState<string[]>([]);

    useEffect(()=>{
        set_data( props.memory.map(val=>{
            if(props.vis_type === "float"){
                let v = new DataView(new ArrayBuffer(4));
                v.setUint32(0, val);
                return v.getFloat32(0).toString();
            } else {
                return val.toString();
            }
        }));
    }, [props.memory, props.vis_type]);

    return (
        <UIPanel key="memory_viewer"  level="level_2">
            <SimpleContent name={"Memory Viewer"}>
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gridColumnGap: "0.5em",
                    height: "21em"
                }}
                     key="mem_view_content">
                    <SelectableList
                        style={{
                            height: "100%"
                        }}
                        items={addresses}
                    />
                    <SelectableList
                        items={data}
                    />
                </div>
            </SimpleContent>
        </UIPanel>
    );
};

export default MemoryViewer;
