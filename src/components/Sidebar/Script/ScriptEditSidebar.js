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
    FormLayout,
    InputField,
    SimpleContent,
    UIPanel
} from "../../UI_elements";

import {Responsive, WidthProvider} from "react-grid-layout";
let ScriptEditSidebar = props =>{
    const ResponsiveGridLayout = WidthProvider(Responsive);
    let handle_edit_field = (event) => {
        if(event.key==="Enter"|| event.key ==="Tab"){
            props.selected_script.edit_field(event.target.name, event.target.value);
        }
    }

    return(
    <ResponsiveGridLayout
        className="layout"
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 24, md: 20, sm: 12, xs: 8, xxs: 4 }}
        rowHeight={30}
    >
        <UIPanel key="script_properties" data-grid={{x: 2, y: 0, w: 24, h: 5}} level="level_2">
            <SimpleContent name="Script Properties" content={
                <FormLayout>
                    <InputField inline name='name' placeholder={props.selected_script.name} onKeyDown={handle_edit_field} label='name'/>
                    <InputField inline name='path' placeholder={props.selected_script.path} onKeyDown={handle_edit_field} label='path'/>
                    <InputField inline name='triggers' placeholder={props.selected_script.triggers} onKeyDown={handle_edit_field} label='triggers'/>
                </FormLayout>
            }/>
        </UIPanel>
    </ResponsiveGridLayout>
    )
};

export default ScriptEditSidebar;