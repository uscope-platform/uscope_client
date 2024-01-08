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

import React, {useReducer} from 'react';

import {Responsive, WidthProvider} from "react-grid-layout";
import {InputField, SelectField, SimpleContent, UIPanel} from "../../../UI_elements";
import {useDispatch, useSelector} from "react-redux";
import {MdAdd} from "react-icons/md";
import {up_emulator} from "../../../../client_core";
import {setSetting} from "../../../../redux/Actions/SettingsActions";
import NodeIomProperties from "./NodeIomProperties";
import EmulatorCoreProperties from "./EmulatorCoreProperties";

let  EmulatorNodeProperties = props =>{

    const emulators_store = useSelector(state => state.emulators);
    const settings = useSelector(state => state.settings);
    const selected_component_obj = settings.emulator_selected_component;

    const sel_component_type = selected_component_obj ? selected_component_obj.type : null;


    if(sel_component_type === "node" && settings.selected_emulator){
        let selected_core = Object.values(emulators_store[parseInt(settings.selected_emulator)].cores).filter((item)=>{
            return item.id === selected_component_obj.obj.id;
        })[0];

        const selected_emulator = settings.selected_emulator ? new up_emulator(emulators_store[parseInt(settings.selected_emulator)]): null;


        const ResponsiveGridLayout = WidthProvider(Responsive);

        return(
            <ResponsiveGridLayout
                className="layout"
                breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                cols={{ lg: 24, md: 20, sm: 12, xs: 8, xxs: 4 }}
                useCSSTransforms={false}
            >
                <UIPanel key={"Item properties"} data-grid={{x: 0, y: 0, w: 24, h: 2, static: true}} level="level_2">
                    <SimpleContent name={"Node Properties"} content={
                        <EmulatorCoreProperties
                            selected_core={selected_core}
                            selected_emulator={selected_emulator}
                        />
                    } />
                </UIPanel>
                <UIPanel key={"iom properties"} data-grid={{x: 0, y: 2, w: 24, h: 2, static: true}} level="level_2">
                    <NodeIomProperties
                        selected_core={selected_core}
                        selected_emulator={selected_emulator}
                    />
                </UIPanel>
            </ResponsiveGridLayout>
        );
    }

};

export default EmulatorNodeProperties;
