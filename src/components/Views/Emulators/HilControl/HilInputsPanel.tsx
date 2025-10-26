
// Copyright 2024 Filippo Savi
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
import {InputField, SelectField} from "#UI/index.js";
import type {EmulatorHilInput} from "#interfaces/emulator_view.js";
import {up_emulator} from "#client_core/index.js";
import type {SimpleNumberOption} from "#interfaces/index.js";

interface HilInputsPanelProps {
    inputs: EmulatorHilInput[];
    n_channels: number;
    emulator: up_emulator;
}

let HilInputsPanel = function (props: HilInputsPanelProps) {

    let [selected_channel, set_selected_channel] = React.useState(Array(props.inputs.length).fill(0));
    
    let get_channels_list = (): SimpleNumberOption[] =>{
        let channels_idx = Array.from({ length: props.n_channels }, (_, i) => i );
        return channels_idx.map((index) =>{
            return {label: index.toString(), value: index}
        }).filter((item)=> item !== undefined);
    }

    let handle_input =async (event: React.KeyboardEvent<HTMLInputElement>, selected_channel: number) =>{
        if(event.key==="Enter"|| event.key ==="Tab") {
            let input = event.currentTarget.name;
            let value = parseFloat(event.currentTarget.value);
            let current_in = props.inputs.filter((i) =>{
                return i.name === input;
            })[0];
            if(current_in === undefined) return;
            await props.emulator.set_input(current_in.core, current_in.name, selected_channel, value);
        }
    }


    let render_inputs= () =>{
        let ret: React.ReactNode[] =  [];
        props.inputs.map((ti, idx)=>{
            let selected_value: number = 0
            let v =  ti.value[0];
            if(v !== undefined) selected_value = v;
            if(ti.value.length > 1){
                let v = ti.value[selected_channel[idx]];
                if(v !== undefined) selected_value = v;
            }

            let handle_select_channel = async (value: SimpleNumberOption | null) =>{
                if(value === null) return;
                let c = selected_channel.map((val,map_idx)=>{
                    if(map_idx === idx) return value.value;
                    else return val;
                });
                set_selected_channel(c);
            }

            ret.push(
                <div key={ ti.name + "_" + idx} style={{
                    display:"grid",
                    gridTemplateColumns:"1fr 2fr 1fr"}}>
                    <p>{ti.name}</p>
                    <InputField
                        compact
                        name={ti.name}
                        id={ti.name}
                        label={ti.name}
                        defaultValue={selected_value.toString()}
                        onKeyDown={async (e: React.KeyboardEvent<HTMLInputElement>)=>{
                            await handle_input(e, selected_channel[idx])
                        }
                    }
                    />
                    <SelectField<SimpleNumberOption>
                        label={""}
                        onChange={handle_select_channel}
                        value={{value: selected_channel[idx], label: selected_channel[idx]}}
                        name="channel_selector"
                        options={get_channels_list()}
                    />
                </div>
            )
        })
        return ret;
    }


    return(
        <div>
            {render_inputs()}
        </div>
    );
};


export default HilInputsPanel;







