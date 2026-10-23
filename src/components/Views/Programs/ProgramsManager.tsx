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

import React, {useEffect} from "react";
import {useLocation} from "react-router";

import {EditorTabs, MainPane, PaneGroup, UIPanel, useEditorTabs} from "#UI/index.js";
import ProgramsEditor from "./Editor/ProgramsEditor.js";
import {up_program} from "#client_core/index.js";
import ProgramSidebar from "./ProgramSidebar.js";
import {useAppSelector} from "#redux/hooks.js";

interface ProgramsManagerProps {

}

let ProgramsManager = (props: ProgramsManagerProps) =>{

    const location = useLocation();

    const programs_store = useAppSelector(state => state.programs);

    const tabs = useEditorTabs(programs_store);

    useEffect(() => {
        if(location.state){
            if(location.state.selected_program){
                let prog = Object.values(programs_store).filter((prog)=>{
                    return prog.name === location.state.selected_program
                })[0];
                if(prog) tabs.activate(prog.id);
            }
        }
    }, []);

    // the panels of the sidebar are the ones of the program that is shown
    const shown = tabs.active_id !== null ? programs_store[tabs.active_id] : undefined;

    return(
        <PaneGroup id="programs" orientation="horizontal">
            <MainPane>
            <PaneGroup id="programs_main" orientation="vertical">
                <UIPanel id="source" key="program_source" level="level_2" default_size={100} min_size="8em">
                    <EditorTabs
                        title="Source Code"
                        empty_message="Select a program from the list to edit it."
                        items={tabs.open_items}
                        active_id={tabs.active_id}
                        preview_id={tabs.preview_id}
                        on_select={tabs.set_active_id}
                        on_keep={tabs.keep}
                        on_close={tabs.close}
                        render_editor={(program, on_dirty_change) => (
                            <ProgramsEditor program={new up_program(program)} on_dirty_change={on_dirty_change}/>
                        )}
                    />
                </UIPanel>
            </PaneGroup>
            </MainPane>
            <ProgramSidebar
                on_select={tabs.select}
                on_reselect={tabs.keep}
                on_activate={tabs.activate}
                program={shown ? new up_program(shown) : null}
            />
        </PaneGroup>
    );

};


export default ProgramsManager;
