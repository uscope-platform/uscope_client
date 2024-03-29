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

import React, {useState} from 'react';

import {useDispatch, useSelector} from "react-redux";
import {get_next_id, up_bitstream, upload_raw} from "../../client_core";
import {
    SelectableList,
    SimpleContent,
    UIPanel
} from "../UI_elements";
import {Responsive, WidthProvider} from "react-grid-layout";
import {setSetting} from "../../redux/Actions/SettingsActions";
import SideToolbar from "./SideToolbar";


let  BitstreamSidebar = props =>{

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

    let handleAdd = () =>{

        let ids = Object.values(bitstreams_store).map(a => a.id).sort();
        let id = get_next_id(ids);
        set_bitstream_object({ id:id, name:'new_bitstream_'+id});
        upload_raw().then((event)=>{
            up_bitstream.get_file_content( event).then((file =>{
                bitstream_object['content'] = file.content;
                bitstream_object['name'] = file.name.replace(".bit", "")
                let bitstream = new up_bitstream(bitstream_object);
                bitstream.add_remote().then();
            }));
        })

    };

    let handleRemove = (bitstream) =>{
        let deleted = Object.values(bitstreams_store).filter((bit)=>{
            return bit.name === bitstream;
        })[0];
        dispatch(setSetting(["selected_bitstream", null]));
        up_bitstream.delete_bitstream(deleted).then();

    };

    let get_content = () =>{
        let types = [];
        let items = Object.values(bitstreams_store).map((scr)=>{
            types.push("generic");
            return scr.name;
        })

        return [items, types]
    }


    const [names, types] = get_content();


    let handleImport = () =>{

    };

    let handleExport = () =>{

    };


    return(
        <ResponsiveGridLayout
            className="layout"
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
            cols={{ lg: 24, md: 20, sm: 12, xs: 8, xxs: 4 }}
            useCSSTransforms={false}
        >
            <UIPanel key="bitstream_list" data-grid={{x: 0, y: 0, w: 24, h: 3, static: true}} level="level_2">
                <SimpleContent name="Bitstream List" content={
                    <div>
                        <SideToolbar
                            onAdd={handleAdd}
                            onImport={handleImport}
                            onExport={handleExport}
                            contentName="Bitstream"
                            exportEnabled={settings.selected_bitstream}
                        />
                        <SelectableList items={names} types={types} selected_item={selected_bitstream.name} onRemove={handleRemove} onSelect={handleOnSelect} />
                    </div>

                }/>
            </UIPanel>

        </ResponsiveGridLayout>

    );
};

export default BitstreamSidebar;


