
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

import React, {useContext, useReducer, useState} from 'react';
import {SelectField} from "../../../UI_elements";
import {get_ui_state, save_ui_state} from "../../../../client_core";
import {ApplicationContext} from "../../../../AuthApp";

let HilChannelSelector = function (props) {

    const application = useContext(ApplicationContext);

    let [selected_channels, set_selected_channels]  = useState(()=>{
        let default_state = [{},{},{},{},{},{}];
        let state = get_ui_state(application,'hil_selector_channels',  default_state);
        if( state !== default_state){
            for(let i = 0; i< 6; i++) {
                props.emulator.select_output(i, state[i].value);
            }
        }
        return state;
    });

    let produce_data_options = ()=>{
        if(!props.emulator){
            return {}
        }

        return props.emulator.get_hil_data_points().map(item=>{
            return{label:item.name, value:item}
        })
    }

    const [, forceUpdate] = useReducer(x => x + 1, 0);

    let handle_select_channel = (value, test) =>{
        let ch_n = parseInt(test.name.split("_")[1]);
        let new_ch = selected_channels;
        new_ch[ch_n-1] = value;
        set_selected_channels(new_ch);
        forceUpdate();
        props.emulator.select_output(ch_n-1, value.value);
        save_ui_state(application,'hil_selector_channels', new_ch);
    }

    let render_selectors = () =>{
        let ret =  [];
        for(let i = 0; i< 6; i++){
            ret.push(
                <SelectField
                    inline
                    label={"Channel " + (i+1)}
                    key={"channel_" + (i+1)}
                    onChange={handle_select_channel}
                    value={selected_channels[i]}
                    defaultValue="Select Datapoint"
                    name={"channel_" + (i+1)}
                    options={produce_data_options()}
                />
            )
        }
        return ret;
    }

    return(
        <div>
            {render_selectors()}
        </div>
    );
};


export default HilChannelSelector;







