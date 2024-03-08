
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

import React, {useReducer, useState} from 'react';
import {SelectField} from "../../UI_elements";
import {useStore} from "react-redux";

let HilChannelSelector = function (props) {

    let store = useStore();

    let target_outputs = props.emulator ? props.emulator.get_outputs() : {};
    let [selected_channels, set_selected_channels]  = useState(()=>{
        let old_cache_val = JSON.parse(localStorage.getItem('hil_selector_channels'));
        let app = store.getState().settings.selected_application;
        if(old_cache_val && old_cache_val[app]) return old_cache_val[app];
        else return [{},{},{},{},{},{}]
    });

    const [, forceUpdate] = useReducer(x => x + 1, 0);

    let handle_select_channel = (value, test) =>{
        let ch_n = parseInt(test.name.split("_")[1]);
        let new_ch = selected_channels;
        new_ch[ch_n-1] = value;
        set_selected_channels(new_ch);
        forceUpdate();
        props.emulator.select_output(ch_n-1, parseInt(value.value));
        let old_cache_val = JSON.parse(localStorage.getItem('hil_selector_channels'));
        let app = store.getState().settings.selected_application;
        let new_cache = old_cache_val;
        if(!new_cache) new_cache = {};
        new_cache[app] = new_ch
        localStorage.setItem('hil_selector_channels',JSON.stringify(new_cache));
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
                    options={Object.keys(target_outputs).map((addr)=>{return{label:target_outputs[addr], value:addr}})}
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







