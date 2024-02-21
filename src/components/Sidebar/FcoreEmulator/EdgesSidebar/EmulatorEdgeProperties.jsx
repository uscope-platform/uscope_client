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

import React, {useCallback, useEffect, useReducer, useState} from 'react';

import {Responsive, WidthProvider} from "react-grid-layout";
import {InputField, SelectableList, SimpleContent, UIPanel} from "../../../UI_elements";
import {useDispatch, useSelector} from "react-redux";
import {MdAdd} from "react-icons/md";
import {up_emulator} from "../../../../client_core";
import {setSetting} from "../../../../redux/Actions/SettingsActions";
import DmaChannelsList from "./DmaChannelsList";
import DmaChannelProperties from "./DmaChannelProperties";

let  EmulatorEdgeProperties = props =>{

    const settings = useSelector(state => state.settings);


    let selected_component = null;
    let connections_list = []
    let selected_channel = {name:"", source:{channel:"", register:""}, target:{channel:"", register: ""}};

    const [, forceUpdate] = useReducer(x => x + 1, 0);

    if(props.enabled && props.selected_emulator){

        selected_component = props.selected_emulator.connections.filter((item) => {
            return item.source === settings.emulator_selected_component.obj.from && item.target === settings.emulator_selected_component.obj.to;
        })[0];
        connections_list = selected_component.channels.map((item) => {
            return item.name;
        });

        const source_core = settings.emulator_selected_component.obj.from;
        const target_core = settings.emulator_selected_component.obj.to;

        if(settings.emulator_selected_dma_channel){
            selected_channel = selected_component.channels.filter((item) =>{
                return item.name === settings.emulator_selected_dma_channel;
            })[0];
            if(!selected_channel) selected_channel = {name:"", source:{channel:"", register:""},source_output:"", target:{channel:"", register: ""}, target_input:""};
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
                    <SimpleContent name={"DMA channel properties"} content={
                        <DmaChannelsList
                            connections_list={connections_list}
                            selected_emulator={props.selected_emulator}
                            source_core={source_core}
                            target_core={target_core}
                            forceUpdate={forceUpdate}
                        />
                    }/>
                </UIPanel>
                <UIPanel key="channel_properties_tab" data-grid={{x: 0, y: 2, w: 24, h: 2.2, static: true}} level="level_2">
                    <SimpleContent name={"DMA channel properties"} content={
                        <DmaChannelProperties
                            selected_emulator={props.selected_emulator}
                            selected_component={selected_component}
                            source_core={source_core}
                            target_core={target_core}
                            selected_channel={selected_channel}
                        />
                    }/>
                </UIPanel>
            </ResponsiveGridLayout>
        )

    }



};

export default EmulatorEdgeProperties;
