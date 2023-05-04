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

import {
    download_json,
    get_next_id,
    import_peripherals,
    up_peripheral,
    upload_json
} from "../../client_core";
import {
    UIPanel,
    SimpleContent,
    SelectableList
} from "../UI_elements";
import {Responsive, WidthProvider} from "react-grid-layout";
import {setSetting} from "../../redux/Actions/SettingsActions";
import {addPeripheral} from "../../redux/Actions/peripheralsActions";
import SideToolbar from "./SideToolbar";

let  PeripheralsSidebar = props =>{

    const ResponsiveGridLayout = WidthProvider(Responsive);

    const peripherals_redux = useSelector(state => state.peripherals);
    const settings = useSelector(state => state.settings);

    const dispatch = useDispatch();

    useEffect(() => {
        return() =>{
            dispatch(setSetting(["current_peripheral", null]));
        }
    },[dispatch]);

    let handleOnSelect = (selection) => {
        if(settings.current_peripheral !==selection){
            dispatch(setSetting(["current_peripheral", selection]));
        }
    };


    let handleRemove = (periph) =>{
        dispatch(setSetting(["current_peripheral", null]));
        up_peripheral.delete_periperal(periph).then();
    };

    let handleExport = (event) =>{
        let selected = settings.current_peripheral;

        let peripheral = {[selected]:peripherals_redux[selected]};
        download_json(peripheral,selected);

    };

    let handleImport = () =>{
        upload_json().then((content)=>{
            import_peripherals(content).then((periphs)=>{
                for(let p of periphs){
                    addPeripheral(p);
                }
            }).catch((err)=>{
                alert(err);
            });
        })
    };

    let handleAdd = (content) => {
        let ids = Object.values(peripherals_redux).map((periph)=>{
            const regex = /new_peripheral_(\d+)/g;
            let match = Array.from(periph.peripheral_name.matchAll(regex), m => m[1]);
            if(match.length>0){
                return match;
            }
        });
        ids = ids.filter(Boolean);
        let id = get_next_id(ids.sort());
        up_peripheral.construct_empty("new_peripheral_"+id).add_remote().then();
    };



    let get_content = () =>{
        let types = [];
        let items = Object.values(peripherals_redux).map((periph)=>{
            types.push("generic");
            return periph.peripheral_name;
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
            <UIPanel key="peripherals_list" data-grid={{x: 0, y: 0, w: 24, h: 7, static: true}} level="level_2">
                <SimpleContent name="Peripherals List" content={
                    <div>
                        <SideToolbar
                            onAdd={handleAdd}
                            onImport={handleImport}
                            onExport={handleExport}
                            contentName="Peripherals"
                            exportEnabled={settings.current_peripheral}
                        />
                        <SelectableList items={names} types={types} selected_item={settings.current_peripheral} onRemove={handleRemove} onSelect={handleOnSelect} />
                    </div>
                }/>
            </UIPanel>
        </ResponsiveGridLayout>
    );
};

export default PeripheralsSidebar;


