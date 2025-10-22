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
import {SimpleContent, UIPanel} from "#UI/index.js";

interface WarningsPanelProps {
    compile_warning: any;
    enabled: boolean;
}

let  WarningsPanel = (props:WarningsPanelProps) =>{

    if(props.compile_warning && props.enabled){

        let print_warnings = () =>{
            let ret: React.ReactNode[] = []
            props.compile_warning.map((item: any)=>{

                let warning_string = item[0].source + "." + item[0].name + "[" + item[0].address + "]";
                ret.push(
                    <div key={warning_string}>
                        <p>{warning_string}</p>
                    </div>
                )
                warning_string = item[1].source + "." + item[1].name + "[" + item[1].address + "]";
                ret.push(
                    <div key={warning_string}>
                        <p style={{marginLeft: "2em"}}>{warning_string}</p>
                    </div>
                )

            })
            return ret;
        }

        return(
            <UIPanel key="warnings" style={{margin:10}} level="level_2">
                <SimpleContent name={"Warnings"}>
                    <div style={{display:"flex", flexDirection:"column", gap:"0.25em", margin:"0.5em"}}>
                        {print_warnings()}
                    </div>
                </SimpleContent>
            </UIPanel>
        )

    }
};

export default WarningsPanel;
