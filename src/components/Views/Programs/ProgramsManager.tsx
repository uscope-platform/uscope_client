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

import React, {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";

import {
    UIPanel,
    SimpleContent,
    FormLayout,
    InputField,
    SelectField,
    TabbedContent, TwoColumnSelector
} from "#UI/index.js";
import ProgramsEditor from "./Editor/ProgramsEditor.js";
import {up_program} from "#client_core/index.js";
import BuildSettings from "./Editor/BuildSettings.js";
import ProgramSidebar from "./ProgramSidebar.js";
import {useAppSelector} from "#redux/hooks.js";

interface ProgramsManagerProps {

}

let ProgramsManager = (props: ProgramsManagerProps) =>{

    const location = useLocation();

    const programs_store = useAppSelector(state => state.programs);


    let [selected_program, set_selected_program] = useState(up_program.construct_empty(9999));
    let [selectedTab, set_selectedTab] = useState(0);

    let allowed_types = [
        {label:"asm", value:"asm"},
        {label:"C", value:"C"},
        {label:"H", value: "H"}
    ];

    const headers = Object.values(programs_store).filter((p) =>{
        return p.type === "H";
    })
    useEffect(() => {
        if(location.state){
            if(location.state.selected_program){
                let prog = Object.values(programs_store).filter((prog)=>{
                    return prog.name === location.state.selected_program
                })[0];
                set_selected_program(new up_program(prog));
            }
        }
    }, []);

    let handle_select = (sel: number) =>{
        let program = programs_store[sel];
        if(program===undefined) return;
        set_selected_program(new up_program(program));
    }

    const calculate_headers = (): {selected:string[], available:string[]} =>{
        if(!selected_program.headers){
            return {selected:[], available:[]};
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

    let handleDeselectHeader =  (id: string) =>{
        selected_program.remove_header(parseInt(id)).then(()=>{
            h = calculate_headers();
        });
    }

    let handleSelectHeader = (id: string) =>{
        selected_program.add_header(parseInt(id)).then(()=>{
            h = calculate_headers();
        });
    }


    let handleTypeChange = (event : any) =>{
        selected_program.edit_field("type", event.value).then();
    }

    let handle_name_change = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter" || event.key === "Tab") {
            selected_program.edit_field(event.currentTarget.name as keyof up_program, event.currentTarget.value).then();
        }
    }

    let handle_settings_edit = (settings: any) => {
        //TODO: REMOVE WHEN THE PROGRAMMING OF CORES IS REWORKED
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
                    <SimpleContent name="Program Properties" >
                        <FormLayout>
                            <InputField inline name='name' placeholder={selected_program.name} onKeyDown={handle_name_change} label="Name"/>
                            <SelectField
                                label="Program type"
                                onChange={handleTypeChange}
                                value={{label:selected_program.type, value:selected_program.type}}
                                defaultValue="Select Type"
                                name="type"
                                options={allowed_types}/>
                        </FormLayout>
                    </SimpleContent>
                </UIPanel>
                <UIPanel style={{flexGrow:1}} key="program_source" level="level_2">
                    <TabbedContent names={["Souce Code", "Build Settings", "Headers"]} onSelect={set_selectedTab} selected={selectedTab}>
                        <div key="program_editor">
                            <ProgramsEditor
                                program={selected_program}
                            />
                        </div>
                        <div key="build_settings">
                            <BuildSettings  build_settings={{}} onEdit={handle_settings_edit}/>
                        </div>
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
                    </TabbedContent>
                </UIPanel>
            </div>
            <div style={{minWidth:"300px"}}>
                <ProgramSidebar
                    on_select={handle_select}
                />
            </div>
        </div>
    );

};


export default ProgramsManager;
