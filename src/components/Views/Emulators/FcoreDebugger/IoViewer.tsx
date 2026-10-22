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
import {DataTable, SimpleContent, UIPanel} from "#UI/index.js";
import {format_word} from "./format_word.js";

interface IoViewerProps {
    vis_type: string,
    io:{
        names: string[],
        values: number[],
    },
    height: string,
}

let  IoViewer = (props: IoViewerProps) =>{
    const rows = props.io.names.map((name, i) => [name, format_word(props.io.values[i] ?? 0, props.vis_type)]);

    return (
        <UIPanel key="io_viewer" level="level_2">
            <SimpleContent name={"Inputs"} height={props.height}>
                <DataTable
                    columns={[{title: "Name"}, {title: "Value", numeric: true}]}
                    rows={rows}
                    empty="The inputs of the core show up when the emulation stops"
                />
            </SimpleContent>
        </UIPanel>
    );
};

export default IoViewer;
