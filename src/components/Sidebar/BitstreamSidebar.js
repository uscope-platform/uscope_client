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

import React, {useRef, useState} from 'react';

import {useDispatch, useSelector} from "react-redux";
import {get_next_id, up_bitstream} from "../../client_core";
import {
    Button,
    SelectableList,
    SimpleContent,
    UIPanel
} from "../UI_elements";
import {Responsive, WidthProvider} from "react-grid-layout";
import {setSetting} from "../../redux/Actions/SettingsActions";


let  BitstreamSidebar = props =>{

    const inputFile = useRef(null)
    const bitstreams_store = useSelector(state => state.bitstreams);
    const settings = useSelector(state => state.settings);

    const [bitstream_object, set_bitstream_object] = useState({})

    const dispatch = useDispatch();

    const selected_bitstream = new up_bitstream(bitstreams_store[settings.selected_bitstream]);

    const ResponsiveGridLayout = WidthProvider(Responsive);

    let handleOnSelect = (selection) => {
        if(settings.selected_bitstream !==selection){
            let selected_bitstreams = Object.values(bitstreams_store).filter((bitstream)=>{
                return bitstream.name === selection;
            })[0];
            dispatch(setSetting(["selected_bitstream", selected_bitstreams.id]));
        }
    };

    let handleAddRow = () =>{

        let ids = Object.values(bitstreams_store).map(a => a.id).sort();
        let id = get_next_id(ids);
        set_bitstream_object({ id:id, name:'new_bitstream_'+id});
        inputFile.current.click();


    };

    let handleRemoveRow = (event) =>{

        dispatch(setSetting(["selected_bitstream", null]));
        up_bitstream.delete_bitstream(selected_bitstream).then();

    };

    let upload_file = (event) => {
        up_bitstream.get_file_content( inputFile).then((file =>{
            bitstream_object['content'] = file.content;
            bitstream_object['name'] = file.name.replace(".bit", "")
            let bitstream = new up_bitstream(bitstream_object);
            bitstream.add_remote().then();
        }));
    }



    let get_content = () =>{
        let types = [];
        let items = Object.values(bitstreams_store).map((scr)=>{
            types.push("generic");
            return scr.name;
        })

        return [items, types]
    }


    const [names, types] = get_content();


    return(
        <ResponsiveGridLayout
            className="layout"
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
            cols={{ lg: 24, md: 20, sm: 12, xs: 8, xxs: 4 }}
            useCSSTransforms={false}
        >
            <UIPanel key="bitstream_list" data-grid={{x: 2, y: 0, w: 24, h: 3, static: true}} level="level_2">
                <SimpleContent name="Bitstream List" content={
                    <SelectableList items={names} types={types} selected_item={selected_bitstream.name} onSelect={handleOnSelect} />
                }/>
            </UIPanel>
            <UIPanel key="bitstream_actions" data-grid={{x: 2, y: 3, w: 24, h: 3, static: true}} level="level_2">
                <SimpleContent name="Bitstream Actions" content={
                    <div style={{display:"flex", flexDirection:"column"}} >
                        <Button style={{margin:"0.5em 1rem"}} onClick={handleAddRow}>Add Bitstream</Button>
                        <Button style={{margin:"0.5em 1rem"}} onClick={handleRemoveRow}>Remove Bitstream</Button>
                        <input type='file' id='bitstream_chooser' ref={inputFile} onChange={upload_file} style={{display: 'none'}}/>
                    </div>
                }/>
            </UIPanel>
        </ResponsiveGridLayout>

    );
};

export default BitstreamSidebar;


