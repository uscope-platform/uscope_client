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
import {download_json, get_next_id, up_program, upload_json} from "../../client_core";
import {
    SelectableList,
    SimpleContent,
    UIPanel
} from "../UI_elements";
import {Responsive, WidthProvider} from "react-grid-layout";
import {setSetting} from "../../redux/Actions/SettingsActions";

import SideToolbar from "./SideToolbar";


let  ProgramSidebar = props =>{

    const programs_store = useSelector(state => state.programs);
    const settings = useSelector(state => state.settings);
    const ResponsiveGridLayout = WidthProvider(Responsive);
    const dispatch = useDispatch();

    useEffect(() => {
        return() =>{
            dispatch(setSetting(["selected_program", null]));
        }
    },[dispatch]);


    let selected_program = programs_store[settings.selected_program];
    let selected_program_obj = new up_program(selected_program);


    let handleAdd = () =>{
        let id = get_next_id(Object.values(programs_store).map(a => a.id).sort());
        let program = up_program.construct_empty(id);
        program.add_remote().then();
    };

    let handleRemove = (program) =>{
        let deleted = Object.values(programs_store).filter((scr)=>{
            return scr.name === program;
        })[0];
        dispatch(setSetting(["selected_program", null]));
        up_program.delete_program(deleted).then();
    };


    let get_content = () =>{
        let types = [];
        let items = Object.values(programs_store).map((prg)=>{
            types.push(prg.program_type);
            return prg.name;
        })

        return [items, types]
    }


    const [names, types] = get_content();

    let handleSelect = (item) =>{
        if(settings.selected_program !==item){
            let selected_program = Object.values(programs_store).filter((bitstream)=>{
                return bitstream.name === item;
            })[0];
            dispatch(setSetting(["selected_program", selected_program.id]));
        }
    };


    let handleExport = () =>{
        download_json(selected_program, selected_program.name);
    }

    let handleImport = () =>{
        upload_json().then((prg)=>{
            let program = new up_program(JSON.parse(prg));
            program.add_remote().then();
        }).catch((err)=>{
            alert(err);
        })

    }



    return(
        <ResponsiveGridLayout
            className="layout"
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
            cols={{ lg: 24, md: 20, sm: 12, xs: 8, xxs: 4 }}
            useCSSTransforms={false}
        >
            <UIPanel key="program_props" data-grid={{x: 0, y: 0, w: 24, h: 3, static: true}} level="level_2">
                <SimpleContent name="Program List" content={
                    <div>
                        <SideToolbar
                            onAdd={handleAdd}
                            onImport={handleImport}
                            onExport={handleExport}
                            contentName="Program"
                            exportEnabled={settings.selected_program}
                        />
                        <SelectableList items={names} types={types} selected_item={selected_program_obj.name} onRemove={handleRemove} onSelect={handleSelect} />
                    </div>
                }/>
            </UIPanel>
        </ResponsiveGridLayout>
    );

};

export default ProgramSidebar;