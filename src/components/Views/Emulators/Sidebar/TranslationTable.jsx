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
import {SelectableList, SimpleContent, UIPanel} from "../../../UI_elements/index.jsx";

let  TranslationTable = props =>{

    let [io_addr, set_io_addr] = useState(null);
    let [core_addr, set_core_addr] = useState(null);

    useEffect(() => {
        if(props.enable){
            set_io_addr(props.data.map((line)=>{
                return line[0]
            }));
            set_core_addr(props.data.map((line)=>{
                return line[1]
            }));
        }
    }, [props.data]);


    if(props.enable)
        return (
            <UIPanel key="translation_table" style={{minHeight:"200px"}} level="level_2">
                <SimpleContent name={"Translation Table"} content={[
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gridColumnGap: "1em",
                    }}>
                        <div>
                            <SelectableList
                                items={io_addr}
                            />
                        </div>
                        <div>
                            <SelectableList
                                items={core_addr}
                            />
                        </div>
                    </div>
                ]}/>
            </UIPanel>
        );
};

export default TranslationTable;
