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

import React from 'react';

import {useSelector} from "react-redux";
import {up_program} from "../../client_core";
import {FormLayout, InputField, SelectField, SimpleContent, UIPanel} from "../UI_elements";
import {Responsive, WidthProvider} from "react-grid-layout";



let  ProgramSidebar = props =>{

    const selected_program =  useSelector(state => new up_program(state.programs[state.settings.selected_program]))
    const ResponsiveGridLayout = WidthProvider(Responsive);

    let handle_name_change = (event) =>{
        if(event.key==="Enter"|| event.key ==="Tab"){
            selected_program.edit_field(event.target.name, event.target.value);
        }
    }

    let handleTypeChange = (event) =>{
        selected_program.edit_field(event.target.name, event.target.value).then();
    }

    let allowed_types = ["asm", "C"];

    if(selected_program.id){
        return(
            <ResponsiveGridLayout
                className="layout"
                breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                cols={{ lg: 24, md: 20, sm: 12, xs: 8, xxs: 4 }}
                rowHeight={30}
                useCSSTransforms={false}
            >
                <UIPanel key="program_properties" data-grid={{x: 2, y: 0, w: 24, h: 5, static: true}} level="level_2">
                    <SimpleContent name="Program Properties" content={
                        <FormLayout>
                            <InputField inline name='name' placeholder={selected_program.name} onKeyDown={handle_name_change} label="Name"/>
                            <SelectField label="Program type" onChange={handleTypeChange} defaultValue={selected_program.program_type}
                                         name="program_type" placeholder="Program type" options={allowed_types}/>
                        </FormLayout>
                    }/>
                </UIPanel>
            </ResponsiveGridLayout>
        );
    }

};

export default ProgramSidebar;