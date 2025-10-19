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
import {SelectableList, SimpleContent, UIPanel} from "#UI";

let  TranslationTable = props =>{

    let [channel_io_names, set_channel_io_names] = useState(null)
    let [channel_io_addr, set_channel_io_addr] = useState(null);
    let [channel_core_addr, set_channel_core_addr] = useState(null);

    let [common_io_names, set_common_io_names] = useState(null)
    let [common_io_addr, set_common_io_addr] = useState(null);
    let [common_core_addr, set_common_core_addr] = useState(null);


    useEffect(() => {
        if(props.channel_io){
            set_channel_io_addr(["IO Side", ...props.channel_io.map((line)=>{
                return line[0]
            })]);
            set_channel_core_addr(["Core Side", ...props.channel_io.map((line)=>{
                return line[1].address
            })]);
            set_channel_io_names(["I/O name", ...props.channel_io.map((line)=>{
                return line[1].name
            })]);
        }
        if(props.common_io){
            set_common_io_addr(["IO Side", ...props.common_io.map((line)=>{
                return line[0]
            })]);
            set_common_core_addr(["Core Side", ...props.common_io.map((line)=>{
                return line[1].address
            })]);
            set_common_io_names(["I/O name", ...props.common_io.map((line)=>{
                return line[1].name
            })]);
        }
    }, [props.channel_io, props.common_io]);

    return (
        <UIPanel key="translation_table" style={{minHeight:"200px"}} level="level_2">
            <SimpleContent name={"Translation Table"}>
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    gridColumnGap: "1em",
                    height: "21em"
                }}
                     key="translation_table_content"
                >
                    <SelectableList
                        items={channel_io_names}
                    />
                    <SelectableList
                        items={channel_io_addr}
                    />
                    <SelectableList
                        items={channel_core_addr}
                    />
                    <SelectableList
                        items={common_io_names}
                    />
                    <SelectableList
                        items={common_io_addr}
                    />
                    <SelectableList
                        items={common_core_addr}
                    />
                </div>
            </SimpleContent>
        </UIPanel>
    );
};

export default TranslationTable;
