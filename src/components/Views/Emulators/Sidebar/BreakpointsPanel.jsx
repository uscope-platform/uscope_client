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
import { InputField, SelectableList, SimpleContent, UIPanel} from "../../../UI_elements/index.jsx";

let  BreakpointsPanel = props =>{

    let [breakpoints, set_breakpoints] = React.useState([]);

    let handle_remove = async (value)=>{

        await props.emulator.remove_breakpoint(value);
        set_breakpoints(breakpoints.filter(b =>{
            return b !== value;
        }))

    }

    let handle_add = async (event)=>{
        if(event.key==="Enter"|| event.key ==="Tab") {
            let value = parseInt(event.target.value);
            await props.emulator.add_breakpoint(value);
            set_breakpoints([...breakpoints, value]);
        }
    }
    if(props.enable)
    return (
        <UIPanel key="breakpoints" style={{minHeight:"200px"}} level="level_2">
            <SimpleContent name={"Breakpoints"} content={[
                    <InputField inline ID="add_breakpoint" name="add_breakpoint" label="Add Breakpoint" onKeyDown={handle_add}/>,
                    <SelectableList
                        onRemove={handle_remove}
                        items={breakpoints}
                    />
            ]}/>
        </UIPanel>
    );
};

export default BreakpointsPanel;
