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

import React from 'react';

import ChannelSelectorItem from "./ChannelSelectorItem";

import {get_channel_number_from_id} from "../../../client_core";

let ChannelSelector = function(props) {

    let get_state = ()=>{
        let new_ch_state = {}
        props.data.map(chan => {
            new_ch_state[chan.spec.number] = chan.visible;
            return 0;
        })
        return new_ch_state;
    }

    let handle_status_change = status =>{
        let new_state = get_state();
        let channel_number = get_channel_number_from_id(status.id, props.data);
        new_state[parseInt(channel_number)] = status.status;
        props.on_channel_status_change(new_state);

    }

    return(
            <div>
                    {   props.data?
                        props.data.map((chan,i) => {
                        return(
                            <ChannelSelectorItem
                                onStatusChange={handle_status_change}
                                key={chan.spec.id}
                                id={chan.spec.id}
                                idx={i}
                                name={chan.spec.name}
                                value={chan.visible}
                            />
                        );
                    }):<></>
                    }
            </div>
        );
};

export default ChannelSelector;
