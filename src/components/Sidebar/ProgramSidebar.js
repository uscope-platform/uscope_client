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

import React, {useEffect} from 'react';

import {useDispatch, useSelector} from "react-redux";
import {get_next_id, up_program} from "../../client_core";
import {
    Button,
    SelectableList,
    SimpleContent,
    UIPanel
} from "../UI_elements";
import {Responsive, WidthProvider} from "react-grid-layout";
import {setSetting} from "../../redux/Actions/SettingsActions";
import ButterToast, { POS_TOP, POS_RIGHT, Cinnamon} from "butter-toast";

const compile_status_position = {
    vertical: POS_TOP,
    horizontal: POS_RIGHT
};


let  ProgramSidebar = props =>{

    const programs_store = useSelector(state => state.programs);
    const settings = useSelector(state => state.settings);

    const dispatch = useDispatch();

    useEffect(() => {
        return() =>{
            dispatch(setSetting(["selected_programs", null]));
        }
    },[dispatch]);

    const ResponsiveGridLayout = WidthProvider(Responsive);

    let selected_programs = Object.values(programs_store).filter((prg)=>{
        return prg.name === settings.selected_program;
    });
    let selected_program = null;
    if(selected_programs && selected_programs.length===1) {
        selected_program = selected_programs[0];
    }


    let handleAddRow = () =>{
        let id = get_next_id(Object.values(programs_store).map(a => a.id).sort());
        let program = up_program.construct_empty(id);
        program.add_remote().then();
    };

    let handleRemoveRow = (event) =>{
        dispatch(setSetting(["selected_programs", null]));
        up_program.delete_program(programs_store[settings.selected_program]).then();
    };

    let handleProgramEdit = () => {
        if(settings.selected_program===null){
            alert("Please select a script to edit");
            return;
        }
        dispatch(setSetting(["script_editor_title", settings.selected_program]));
    };


    let get_content = () =>{
        let types = [];
        let items = Object.values(programs_store).map((scr)=>{
            types.push("generic");
            return scr.name;
        })

        return [items, types]
    }



    let handle_compile = () =>{

        if(settings.selected_program===null){
            alert("Please select a script to compile");
            return;
        }

        selected_program.compile().then((data)=>{
            let notifications={passed:[],failed:[]};
            for (let item of data){
                if(item.status==="passed"){
                    notifications.passed.push(
                        ButterToast.raise({
                            content: <Cinnamon.Crisp title={item.file}
                                                     content="Compilation was successful"
                                                     scheme={Cinnamon.Crisp.SCHEME_GREEN}/>
                        })
                    )
                } else if (item.status==="failed"){
                    notifications.failed.push(
                        ButterToast.raise({
                            content: <Cinnamon.Crisp title={item.file}
                                                     content={item.error}
                                                     scheme={Cinnamon.Crisp.SCHEME_RED}/>
                        })
                    )
                }
            }
            window.setTimeout(()=>{
                for(let notif of notifications.passed){
                    ButterToast.dismiss(notif);
                }
            },3000);

        });

    }

    let handle_apply_program = () =>{
        let core_address = '0x83c00000';
        selected_program.load(core_address).then();
    };

    const [names, types] = get_content();

    let handleSelect = (item) =>{
        if(settings.selected_program !==item){
            dispatch(setSetting(["selected_program", item]));
        }
    };

    return(
        <ResponsiveGridLayout
            className="layout"
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
            cols={{ lg: 24, md: 20, sm: 12, xs: 8, xxs: 4 }}
            useCSSTransforms={false}
        >
            <ButterToast
                position={compile_status_position}
            />
            <UIPanel key="program_props" data-grid={{x: 2, y: 0, w: 24, h: 3, static: true}} level="level_2">
                <SimpleContent name="Program List" content={
                    <SelectableList items={names} types={types} selected_item={settings.selected_program} onSelect={handleSelect} />
                }/>
            </UIPanel>
            <UIPanel key="program_actions" data-grid={{x: 2, y: 3, w: 24, h: 3, static: true}} level="level_2">
                <SimpleContent name="Program Actions" content={
                    <div style={{display:"flex", flexDirection:"column"}} >
                        <Button style={{margin:"0.5em 1rem"}} onClick={handleAddRow}>Add Program</Button>
                        <Button style={{margin:"0.5em 1rem"}} onClick={handleRemoveRow}>Remove Program</Button>
                        <Button style={{margin:"0.5em 1rem"}} onClick={handleProgramEdit}>Edit Program</Button>
                        <Button style={{margin:"0.5em 1rem"}} onClick={handle_compile}>Compile Program</Button>
                        <Button style={{margin:"0.5em 1rem"}} onClick={handle_apply_program}>Load Program</Button>
                    </div>
                }/>
            </UIPanel>
        </ResponsiveGridLayout>
    );

};

export default ProgramSidebar;
