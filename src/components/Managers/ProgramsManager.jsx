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
    TabbedContent, TwoColumnSelector
} from "../UI_elements";

import {useSelector} from "react-redux";
import ProgramsEditor from "../Editors/Programs/ProgramsEditor";
import {up_program} from "../../client_core";
import BuildSettings from "../Editors/Programs/BuildSettings";
import ProgramSidebar from "../Sidebar/ProgramSidebar";

let ProgramsManager = props =>{


    const programs_store = useSelector(state => state.programs);

    let [selected_program, set_selected_program] = useState({});

    let [selectedTab, set_selectedTab] = useState(0);

    let allowed_types = [
        {label:"asm", value:"asm"},
        {label:"C", value:"C"},
        {label:"H", value: "H"}
    ];

    const headers = Object.values(programs_store).filter((p) =>{
        return p.program_type === "H";
    })


    let handle_select = (sel) =>{
        set_selected_program(new up_program(programs_store[sel]));
    }

    const calculate_headers = () =>{
        if(!selected_program.headers){
            return [];
        }
        for(let i of selected_program.headers){

            if(headers.filter(h=>h.id === i).length === 0){
                selected_program.remove_header(i).then();
            }
        }
        let sel = Object.values(headers).map((val)=>{
            if(selected_program.headers.includes(val.id)){
                return val.name;
            }
        }).filter(item => item);

        let av = Object.values(headers).filter((val)=>{
            return !sel.includes(val.name);
        }).map((prg)=>{
            return prg.name;
        })

        return {selected:sel, available:av}
    };

    let h = calculate_headers();

    let handleDeselectHeader =  (id) =>{
        selected_program.remove_header(parseInt(id)).then(()=>{
            h = calculate_headers();
        });
    }

    let handleSelectHeader = (id) =>{
        selected_program.add_header(parseInt(id)).then(()=>{
            h = calculate_headers();
        });
    }


    let handleTypeChange = (event) =>{
        selected_program.edit_field("program_type", event.value).then();
    }

    let handle_name_change = (event) => {
        if (event.key === "Enter" || event.key === "Tab") {
            selected_program.edit_field(event.target.name, event.target.value).then();
        }
    }

    let handle_settings_edit = (settings) => {
        selected_program.edit_field("build_settings", settings).then();
    }

    let get_tabs_content = ()=>{
        let res = [
            <div key="program_editor">
                <ProgramsEditor
                    program={selected_program}
                    application={props.application}
                />
            </div>
        ]
        if(selected_program.program_type==="C"){
            res.push(
                <div key="build_settings">
                    <BuildSettings  language={selected_program.language} build_settings={selected_program.build_settings} onEdit={handle_settings_edit}/>
                </div>
            )
            res.push(
                <div key="headers_selector">
                    <TwoColumnSelector
                        itemType="headers"
                        data={programs_store}
                        display_field="name"
                        selected_items={h.selected}
                        available_items={h.available}
                        onSelect={handleSelectHeader}
                        onDeselect={handleDeselectHeader}
                    />
                </div>
            )
        }
        return(res);
    }

    let get_tabs_names = ()=>{
        return ["Souce Code", "Build Settings", "Headers"]
    }

    return(
        <div style={{
            display:"flex",
            flexDirection:"row",
            gap:10,
            height:"100%"
        }}>
            <div style={{
                display:"flex",
                flexDirection:"column",
                gap:10,
                flexGrow:1,
                height:"100%"
            }}>
                <UIPanel key="program_properties" level="level_2">
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
                <UIPanel style={{flexGrow:1}} key="program_source" level="level_2">
                    <TabbedContent names={get_tabs_names()} contents={get_tabs_content()} onSelect={set_selectedTab} selected={selectedTab}/>
                </UIPanel>
            </div>
            <div style={{minWidth:"300px"}}>
                <ProgramSidebar
                    on_select={handle_select}
                    application={props.application}
                />
            </div>
        </div>
    );

};


export default ProgramsManager;
