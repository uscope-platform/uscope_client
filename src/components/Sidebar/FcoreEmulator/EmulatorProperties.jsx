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
import {InputField, SimpleContent, ToggleField, UIPanel} from "../../UI_elements";
import {useSelector} from "react-redux";

let  EmulatorProperties = props =>{

    const settings = useSelector(state => state.settings);

    const [, forceUpdate] = useReducer(x => x + 1, 0);


    let handle_change = (event) =>{
        if(event.key==="Enter"|| event.key ==="Tab") {
            if (event.target.name === "name"){
                props.selected_emulator.edit_name(event.target.value).then(() => {
                    forceUpdate();
                });
            } else if(event.target.name === "n_cycles"){
                props.selected_emulator.edit_cycles(parseInt(event.target.value)).then(()=>{
                    forceUpdate();
                });
            }
        } else if(event.key===undefined){
            props.selected_emulator.edit_async_multirate(event.target.checked).then(() =>{
                forceUpdate();
            })
        }
    }


    const ResponsiveGridLayout = WidthProvider(Responsive);

    if(settings.emulator_selected_tab === 0 && props.selected_emulator && props.enabled){
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
                                <InputField inline ID="name" name="name" label="Emulator Name" defaultValue={props.selected_emulator.name} onKeyDown={handle_change}/>
                                <InputField inline ID="n_cycles" name="n_cycles" label="Number of cycles" defaultValue={props.selected_emulator.n_cycles} onKeyDown={handle_change}/>
                                <ToggleField inline name="async_multirate" label={["Synchronous", "Asynchronous"]} value={props.selected_emulator.async_multirate} onChange={handle_change}/>
                            </div>
                        }
                        />
                    }
                </UIPanel>
            </ResponsiveGridLayout>
        );
    }

};

export default EmulatorProperties;
