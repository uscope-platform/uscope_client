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
    Button,
    SelectableList,
    SimpleContent,
    UIPanel
} from "../UI_elements";
import {Responsive, WidthProvider} from "react-grid-layout";
import {setSetting} from "../../redux/Actions/SettingsActions";
import ButterToast, { POS_TOP, POS_RIGHT, Cinnamon} from "butter-toast";
import {ChapterAdd, Download, Upload} from "grommet-icons";

const compile_status_position = {
    vertical: POS_TOP,
    horizontal: POS_RIGHT
};


let  ProgramSidebar = props =>{

    const programs_store = useSelector(state => state.programs);
    const settings = useSelector(state => state.settings);
    const ResponsiveGridLayout = WidthProvider(Responsive);
    const dispatch = useDispatch();

    useEffect(() => {
        return() =>{
            dispatch(setSetting(["selected_programs", null]));
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
        dispatch(setSetting(["selected_programs", null]));
        up_program.delete_program(deleted).then();
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
        selected_program_obj.load(core_address).then();
    };

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

    let constructActionsBar = () =>{
        let io_color = settings.selected_program ? "white":"gray";
        let click_handler = settings.selected_program ? handleExport:null;
        return(
            <div style={{display:"flex", marginRight:"0.5em", justifyContent:"right"}}>
                <ChapterAdd onClick={handleAdd} style={{marginLeft:"0.3em"}} color="white"/>
                <Upload onClick={handleImport} style={{marginLeft:"0.3em"}} color="white"/>
                <Download onClick={click_handler} style={{marginLeft:"0.3em"}} color={io_color}/>
            </div>
        )
    }

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
            <UIPanel key="program_props" data-grid={{x: 0, y: 0, w: 24, h: 3, static: true}} level="level_2">
                <SimpleContent name="Program List" content={
                    <div>
                        {
                            constructActionsBar()
                        }
                        <SelectableList items={names} types={types} selected_item={selected_program_obj.name} onRemove={handleRemove} onSelect={handleSelect} />
                    </div>

                }/>
            </UIPanel>
            <UIPanel key="program_actions" data-grid={{x: 0, y: 3, w: 24, h: 3, static: true}} level="level_2">
                <SimpleContent name="Program Actions" content={
                    <div style={{display:"flex", flexDirection:"column"}} >
                        <Button style={{margin:"0.5em 1rem"}} onClick={handle_compile}>Compile Program</Button>
                        <Button style={{margin:"0.5em 1rem"}} onClick={handle_apply_program}>Load Program</Button>
                    </div>
                }/>
            </UIPanel>
        </ResponsiveGridLayout>
    );

};

export default ProgramSidebar;
