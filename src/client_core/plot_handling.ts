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


import type {application, channel, channel_group, plot_channel, scope_data_object} from "#interfaces/index.js";

export let create_plot_channel = (ch: channel): plot_channel => {
    return ({
        x: Array.from(Array(1024).keys()),
        y: Array(1024).fill(0),
        type: 'scattergl',
        mode: 'lines',
        name: ch.name,
        visible: ch.enabled,
        spec: ch
    })
}
export let get_channels_from_group = (group: channel_group, channels: channel[]): channel[] => {
    let channels_list: channel[] = []
    for (let ch of group.channels) {
        let selected_ch = channels.filter((item) => {
            return item.id === ch.value;
        })
        if(selected_ch[0] !== undefined) channels_list.push(selected_ch[0])
    }
    return channels_list;
}
export let get_channel_number_from_id = (id: string, channels: any[]) => {
    for (let item of channels) {
        if (item.spec.id === id) return item.spec.number
    }
}

export const initialize_plot = (app: application) =>{

    let [channels_list, group ] = app.get_scope_setup_info();
    let ch_obj = [];
    for(let channel of channels_list){
        ch_obj.push(create_plot_channel(channel))
    }
    return ch_obj
};

/// Copies the samples of a scope frame in the traces, in place (plotly is going to be told about the change by the
/// caller, no copies are made). Returns the indices of the traces that received data
export const apply_scope_data = (plot_data: plot_channel[], raw_data: scope_data_object[]): number[] => {
    let updated: number[] = [];
    plot_data.forEach((item, index) => {
        if(item.spec === undefined) return;
        const number = Number(item.spec.number);
        for(let channel_payload of raw_data){
            if(number === channel_payload.channel){
                item.y = channel_payload.data;
                // the timebase follows the length of the frame
                if(item.x.length !== item.y.length) item.x = Array.from(Array(item.y.length).keys());
                updated.push(index);
            }
        }
    });
    return updated;
}

export const update_plot_status = (old_data:any[], status: Record<number, boolean>)=>{
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
