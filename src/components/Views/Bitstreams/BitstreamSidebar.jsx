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
import {download_bitstream, get_next_id, up_bitstream, upload_raw} from "@client_core";
import {
    SelectableList,
    SimpleContent,
    UIPanel,
    SideToolbar
} from "@UI";


let  BitstreamSidebar = props =>{

    const bitstreams_store = useSelector(state => state.bitstreams);

    let handleOnSelect = (selection) => {
        if(props.bitstream.name !==selection){
            let bit = Object.values(bitstreams_store).filter((bitstream)=>{
                return bitstream.name === selection;
            })[0];
            props.on_select(bit);
        }
    };

    let handleAdd = async () =>{

        let ids = Object.values(bitstreams_store).map(a => a.id).sort();
        let id = get_next_id(ids);
        let event = await upload_raw();
        let file = await  up_bitstream.get_file_content( event);

        let bitstream = new up_bitstream({
            id:id,
            name:file.name,
            data:file.content,
            path:file.name
        });
        bitstream.add_remote().then();

    };

    let handleRemove = (bitstream) =>{
        let deleted = Object.values(bitstreams_store).filter((bit)=>{
            return bit.name === bitstream;
        })[0];
        props.on_select({name:""})
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

    let handleExport = async () =>{
        let file = await props.bitstream.export_bitstream();
        download_bitstream(file.data, file.name);
    };


    return(
        <UIPanel key="bitstream_list" level="level_2">
            <SimpleContent name="Bitstream List" content={
                <div>
                    <SideToolbar
                        onAdd={handleAdd}
                        onImport={handleImport}
                        onExport={handleExport}
                        contentName="Bitstream"
                        exportEnabled={props.bitstream}
                    />
                    <SelectableList
                        items={names}
                        types={types}
                        selected_item={props.bitstream.name}
                        onRemove={handleRemove}
                        onSelect={handleOnSelect}
                    />
                </div>
            }/>
        </UIPanel>
    );
};

export default BitstreamSidebar;


