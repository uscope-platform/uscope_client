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
import {InputField, SimpleContent, ToggleField, UIPanel} from "../../UI_elements";
import {useSelector} from "react-redux";
import {RangedInputField} from "../../UI_elements/RangedInputField";

let  EmulatorProperties = props =>{

    const settings = useSelector(state => state.settings);

    const [, forceUpdate] = useReducer(x => x + 1, 0);

    const [range, set_range] = useState("s");
    const [indicated_time, set_indicated_time] = useState(0);
    const emulation_time = props.selected_emulator && props.selected_emulator.emulation_time ? props.selected_emulator.emulation_time : 0;
    const ranges_map = {s:1, ms:1e-3, us:1e-6};

    useEffect(() => {
        if(emulation_time){
            let new_range;
            let new_indicated_time;
            if(emulation_time>= 1){
                new_range = "s";
                new_indicated_time = emulation_time;
            } else if(emulation_time>=1e-3){
                new_range = "ms";
                new_indicated_time = emulation_time/ranges_map.ms;
            } else {
                new_range = "us";
                new_indicated_time = emulation_time/ranges_map.us;
            }
            set_range(new_range);
            set_indicated_time(new_indicated_time);
        }
    }, [emulation_time]);


    let handle_change = (event) =>{
        if(event.key==="Enter"|| event.key ==="Tab") {
            if (event.target.name === "name"){
                props.selected_emulator.edit_name(event.target.value).then(() => {
                    forceUpdate();
                });
            } else if(event.target.name === "emulation_time"){
                set_indicated_time(event.target.value);
                let time = parseFloat(event.target.value)*ranges_map[range];
                props.selected_emulator.edit_emulation_time(time).then(()=>{
                    forceUpdate();
                });
            }
        }
    }

    const handle_range_change = (value)=>{
        //TODO: HANDLE RANGE CHANGE
        let time = indicated_time*ranges_map[value];
        props.selected_emulator.edit_emulation_time(time).then(()=>{
            forceUpdate();
        });
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

                                <RangedInputField
                                    ID="emulation_time"
                                    name="emulation_time"
                                    label="Emulation Time"
                                    rangeOptions={["us", "ms", "s"]}
                                    onKeyDown={handle_change}
                                    onRangeChange={handle_range_change}
                                    value={indicated_time}
                                    range={range}
                                />

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
