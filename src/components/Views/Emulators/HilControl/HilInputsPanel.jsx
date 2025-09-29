
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
import {InputField, SelectField} from "@UI";

let HilInputsPanel = function (props) {

    let [selected_channel, set_selected_channel] = React.useState(Array(props.inputs.length).fill(0));
    
    let get_channels_list = () =>{
        let channels_idx = Array.from({ length: props.n_channels }, (_, i) => i );
        return channels_idx.map((index) =>{
            return {label: index, value: index}
        });
    }

    let handle_input = (event, selected_channel) =>{
        if(event.key==="Enter"|| event.key ==="Tab") {
            let input = event.target.name;
            let value = parseFloat(event.target.value);
            let current_in = props.inputs.filter((i) =>{
                return i.name === input;
            })[0];
            props.set_input(current_in.core, current_in.name, selected_channel, value);
        }
    }

    let render_inputs= () =>{
        let ret =  [];
        props.inputs.map((ti, idx)=>{
            let selected_value = ti.value[0]
            if(ti.value.length > 1){
                selected_value = ti.value[selected_channel[idx]]
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
                        defaultValue={selected_value}
                        onKeyDown={(e)=>{
                            handle_input(e, selected_channel[idx])
                        }
                    }
                    />
                    <SelectField
                        inline
                        onChange={(obj, e) =>{
                            let c = selected_channel.map((val,map_idx)=>{
                                if(map_idx === idx) return obj.value;
                                else return val;
                            });
                            set_selected_channel(c);
                        }}
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







