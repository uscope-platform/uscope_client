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
import {useLocation} from "react-router";

import {
    UIPanel,
    SimpleContent
} from "#UI/index.js";
import {MainPane, PaneGroup} from "#UI/index.js";
import ProgramsEditor from "./Editor/ProgramsEditor.js";
import {up_program} from "#client_core/index.js";
import ProgramSidebar from "./ProgramSidebar.js";
import {useAppSelector} from "#redux/hooks.js";

interface ProgramsManagerProps {

}

let ProgramsManager = (props: ProgramsManagerProps) =>{

    const location = useLocation();

    const programs_store = useAppSelector(state => state.programs);

    let [selected_program, set_selected_program] = useState(up_program.construct_empty(9999));

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

    // the program that nothing was selected for is not one of the stored ones
    const has_selection = programs_store[selected_program.id] !== undefined;

    return(
        <PaneGroup id="programs" orientation="horizontal">
            <MainPane>
            <PaneGroup id="programs_main" orientation="vertical">
                <UIPanel id="source" key="program_source" level="level_2" default_size={100} min_size="8em">
                    <SimpleContent name="Source Code">
                        <ProgramsEditor
                            program={selected_program}
                        />
                    </SimpleContent>
                </UIPanel>
            </PaneGroup>
            </MainPane>
            <ProgramSidebar
                on_select={handle_select}
                program={has_selection ? selected_program : null}
            />
        </PaneGroup>
    );

};


export default ProgramsManager;
