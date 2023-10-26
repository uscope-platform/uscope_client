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
import {InputField,  SimpleContent, UIPanel} from "../../UI_elements";
import {useSelector} from "react-redux";
import {up_emulator} from "../../../client_core";

let  EmulatorProperties = props =>{

    const emulators_store = useSelector(state => state.emulators);
    const settings = useSelector(state => state.settings);

    const sel_component_type = settings.emulator_selected_component ? settings.emulator_selected_component.type : null;

    const selected_emulator = settings.selected_emulator ? new up_emulator(emulators_store[parseInt(settings.selected_emulator)]): null;

    const [, forceUpdate] = useReducer(x => x + 1, 0);


    let handle_change = (event) =>{
        if(event.key==="Enter"|| event.key ==="Tab") {
            selected_emulator.edit_name(event.target.value).then(()=>{
                forceUpdate();
            });
        }
    }


    const ResponsiveGridLayout = WidthProvider(Responsive);
    if(!selected_emulator || sel_component_type=== "node"  || sel_component_type === "edge")
        return ;

    return(
        <ResponsiveGridLayout
            className="layout"
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
            cols={{ lg: 24, md: 20, sm: 12, xs: 8, xxs: 4 }}
            useCSSTransforms={false}
        >
            <UIPanel key={"Item properties"} data-grid={{x: 0, y: 0, w: 24, h: 2, static: true}} level="level_2">
                {
                    <SimpleContent name={"Emulator Properties"} content={
                        <div key="emulator_props">
                            <InputField inline ID="name" name="name" label="Emulator Name" defaultValue={selected_emulator.name} onKeyDown={handle_change}/>
                        </div>
                    }
                    />
                }
            </UIPanel>
        </ResponsiveGridLayout>
    );
};

export default EmulatorProperties;
