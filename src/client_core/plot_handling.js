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


import {direct_fetch} from "./proxy/plot";
import {up_peripheral} from "./data_models/up_peripheral";

export let create_plot_channel = (ch) => {
    return ({
        x: Array.from(Array(1024).keys()),
        y: Array(1024).fill(0),
        type: 'scatter',
        mode: 'lines',
        name: ch.name,
        visible: ch.enabled,
        spec: ch
    })
}
export let get_channels_from_group = (group, channels) => {
    let channels_list = []
    for (let ch of group.channels) {
        let selected_ch = channels.filter((item) => {
            return item.id === ch.value;
        })
        channels_list.push(selected_ch[0])
    }
    return channels_list;
}
export let get_channel_number_from_id = (id, channels) => {
    for (let item of channels) {
        if (item.spec.id === id) return item.spec.number
    }
}

export const initialize_plot = (app) =>{

    let [channels_list, group ] = app.get_scope_setup_info();
    let ch_obj = [];
    for(let channel of channels_list){
        ch_obj.push(create_plot_channel(channel))
    }
    return ch_obj
};

export const update_plot_data =async (old_data)=>{
    let raw_data = await direct_fetch();
    return  old_data.map((item)=>{
        let new_item = item;
        for(let channel_payload of raw_data){
            if(parseInt(new_item.spec.number)===channel_payload.channel){
                new_item.y = channel_payload.data;
            }
        }
        return new_item;
    });
}

export const update_plot_status = (old_data, status)=>{
    return old_data.filter(item=>{
        if(item.spec.number in status){
            let new_item = item;
            new_item.visible = status[item.spec.number];
            return new_item;
        } else {
            return item
        }
    });
}

export const setup_scope_mux = (channels, base_addr) =>{
    if(base_addr){
        for(let item of channels){
            if(item){
                let channel_address = base_addr + 4*(parseInt(item.number)+1);
                up_peripheral.direct_register_write([[channel_address, parseInt(item.mux_setting)]]).then();
            }
        }
    }
}