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

import React, {useState} from "react";
import {
    UIPanel,
    SimpleContent,
    FormLayout,
    InputField,
    SelectField,
    TabbedContent
} from "../UI_elements";

import {useSelector} from "react-redux";
import ProgramsEditor from "../Editors/Programs/ProgramsEditor";
import {Responsive, WidthProvider} from "react-grid-layout";
import {up_program} from "../../client_core";
import BuildSettings from "../Editors/Programs/BuildSettings";

let ProgramsManager = props =>{

    const ResponsiveGridLayout = WidthProvider(Responsive);

    const programs_store = useSelector(state => state.programs);
    const settings = useSelector(state => state.settings);


    let selected_program = settings.selected_program ? programs_store[settings.selected_program]: {};
    let selected_program_obj = new up_program(selected_program);
    let [selectedTab, set_selectedTab] = useState(0);

    let allowed_types = [
        {label:"asm", value:"asm"},
        {label:"C", value:"C"}
    ];

    let handleTypeChange = (event) =>{
        selected_program_obj.edit_field("program_type", event.value).then();
    }

    let handle_name_change = (event) => {
        if (event.key === "Enter" || event.key === "Tab") {
            selected_program_obj.edit_field(event.target.name, event.target.value);
        }
    }

    let handle_settings_edit = (settings) => {
        selected_program_obj.edit_field("build_settings", settings);
    }

    let get_tabs_content = ()=>{
        let res = [
            <div key="program_editor">
                <ProgramsEditor program={selected_program} />
            </div>
        ]
        if(selected_program.program_type==="C"){
            res.push(
                <div key="build_settings">
                    <BuildSettings  language={selected_program.language} build_settings={selected_program.build_settings} onEdit={handle_settings_edit}/>
                </div>
            )
        }
        return(res);
    }

    let get_tabs_names = ()=>{
        return ["Souce Code", "Build Settings"]
    }

    return(
        <ResponsiveGridLayout
            className="layout"
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
            cols={{ lg: 24, md: 20, sm: 12, xs: 8, xxs: 4 }}
            rowHeight={30}
            useCSSTransforms={false}
        >
            <UIPanel key="program_properties" data-grid={{x: 0, y: 0, w: 24, h: 5, static: true}} level="level_2">
                <SimpleContent name="Program Properties" content={
                    <FormLayout>
                        <InputField inline name='name' placeholder={selected_program.name} onKeyDown={handle_name_change} label="Name"/>
                        <SelectField
                            label="Program type"
                            onChange={handleTypeChange}
                            value={{label:selected_program.program_type, value:selected_program.program_type}}
                            defaultValue="Select Type"
                            name="program_type"
                            placeholder="Program type"
                            options={allowed_types}/>
                    </FormLayout>
                }/>
            </UIPanel>
            <UIPanel key="program_source" data-grid={{x: 0, y: 5, w: 24, h: 20, static: true}} level="level_2">
                <TabbedContent names={get_tabs_names()} contents={get_tabs_content()} onSelect={set_selectedTab} selected={selectedTab}/>
            </UIPanel>
        </ResponsiveGridLayout>
    );

};


export default ProgramsManager;
