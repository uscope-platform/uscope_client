// Copyright 2021 University of Nottingham Ningbo China
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

export let create_plot_channel = (ch) =>{
    return({
        x: Array.from(Array(1024).keys()),
        y:  Array(1024).fill(0),
        type: 'scatter',
        mode: 'lines',
        name: ch.name,
        visible: ch.enabled,
        spec:ch
    })
}

export let get_channels_from_group = (group, channels) => {
    let channels_list = []
    for(let ch of group.channels) {
        let selected_ch = channels.filter((item) => {
            return item.id === ch.value;
        })
        channels_list.push(selected_ch[0])
    }
    return channels_list;
 }

export let get_channel_number_from_id = (id, channels) => {
    for(let item of channels){
        if(item.spec.id === id) return item.spec.number
    }
}


export let get_channel_mux_from_id = (id, channels) => {
    for(let item of channels){
        if(item.spec.id === id) return item.spec.mux_setting;
    }
}