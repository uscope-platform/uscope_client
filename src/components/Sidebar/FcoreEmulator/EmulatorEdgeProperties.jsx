// Copyright 2023 Filippo Savi
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

import React, {useEffect, useReducer, useState} from 'react';

import {Responsive, WidthProvider} from "react-grid-layout";
import {InputField, SelectableList, SimpleContent, UIPanel} from "../../UI_elements";
import {useSelector} from "react-redux";
import {MdAdd} from "react-icons/md";
import {up_emulator} from "../../../client_core";
import {setSetting} from "../../../redux/Actions/SettingsActions";

let  EmulatorEdgeProperties = props =>{

    let [selected, set_selected] = useState(null);

    const emulators_store = useSelector(state => state.emulators);
    const settings = useSelector(state => state.settings);

    let selected_emulator = new up_emulator(emulators_store[parseInt(settings.selected_emulator)]);

    const sel_component_type = settings.emulator_selected_component ? settings.emulator_selected_component.type : null;

    const source_core = settings.emulator_selected_component.obj.from;
    const target_core = settings.emulator_selected_component.obj.to;

    const [, forceUpdate] = useReducer(x => x + 1, 0);

    let selected_component = null;
    let connections_list = []

    useEffect(() => {
        set_selected(null);
    }, [settings.emulator_selected_component]);

    if(sel_component_type){
        selected_component = emulators_store[settings.selected_emulator].connections.filter((item)=>{
            return item.source === source_core && item.target === target_core;
        })[0];
        connections_list = selected_component.channels.map((item)=>{
            return item.name;
        });
    }

    let handle_add = (event) =>{
        selected_emulator.add_dma_channel(source_core, target_core, connections_list.length).then(() =>{
            forceUpdate();
        });
    }

    let handle_remove = (removed_item) =>{
        selected_emulator.remove_dma_channel(source_core, target_core, removed_item).then(() =>{
            forceUpdate();
        });
    }

    let handle_change = (event) =>{
        if(event.key==="Enter"|| event.key ==="Tab") {
            let field = event.target.name;
            let value = event.target.value;

            if(field !== 'name'){
                let selected_channel = selected_component.channels.filter((item) =>{
                    return item.name === selected;
                })[0];

                let split_field = field.split("_");
                if(split_field[0] === 'source'){
                    value = selected_channel.source;
                    value[split_field[1]] = parseInt(event.target.value);
                } else {
                    value = selected_channel.target;
                    value[split_field[1]] = parseInt(event.target.value);
                }
                field = split_field[0];
            }
            selected_emulator.edit_dma_channel(source_core, target_core,
                field, value, selected).then(()=>{
                if(field === 'name'){
                    set_selected(value)
                }
                forceUpdate();
            });
        }
    }

    let render_channel_props = () =>{
        if (selected) {
            let selected_channel = selected_component.channels.filter((item) =>{
                return item.name === selected;
            })[0];
            return (
                <div key="dma_channel_props">
                    <InputField ID="name" name="name" label="Name" defaultValue={selected_channel.name} onKeyDown={handle_change}/>
                    <InputField ID="source_channel" name="source_channel" label="Source Channel" defaultValue={selected_channel.source.channel} onKeyDown={handle_change}/>
                    <InputField ID="source_register" name="source_register" label="Source Register" defaultValue={selected_channel.source.register} onKeyDown={handle_change}/>
                    <InputField ID="target_channel" name="target_channel" label="Target Channel" defaultValue={selected_channel.target.channel} onKeyDown={handle_change}/>
                    <InputField ID="target_register" name="target_register" label="Target Register" defaultValue={selected_channel.target.register} onKeyDown={handle_change}/>
                </div>
            )
        }
    }

    const ResponsiveGridLayout = WidthProvider(Responsive);

    return(
        <ResponsiveGridLayout
            className="layout"
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
            cols={{ lg: 24, md: 20, sm: 12, xs: 8, xxs: 4 }}
            useCSSTransforms={false}
        >
            <UIPanel key="channels_list" data-grid={{x: 0, y: 0, w: 24, h: 2, static: true}} level="level_2">
                <SimpleContent name={"DMA channels"} content={
                    <div key="edge_props">
                        <div style={{
                            display:"flex",
                            flexDirection:"row",
                            marginTop:"0.25em"
                        }}>
                            <MdAdd style={{marginLeft:"auto"}} onClick={handle_add}/>
                        </div>
                        <SelectableList items={connections_list} selected_item={selected} onSelect={set_selected} onRemove={handle_remove} />
                    </div>
                }/>
            </UIPanel>
            <UIPanel key="channel_properties_tab" data-grid={{x: 0, y: 2, w: 24, h: 2.2, static: true}} level="level_2">
                <SimpleContent name={"DMA channel properties"} content={
                   render_channel_props()
                }/>
            </UIPanel>
        </ResponsiveGridLayout>
    )

};

export default EmulatorEdgeProperties;
