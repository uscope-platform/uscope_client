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

import React, {useCallback, useState} from 'react';
import {useSelector, useStore} from "react-redux";

import {FormLayout,SelectField} from "../../UI_elements";

import {
    set_channel_status,
    up_peripheral,
    get_channels_from_group,
    set_scaling_factors
} from "../../../client_core";
import {setup_scope_mux} from "../../../client_core/plot_handling";

let  EnablesProperties = props =>{

    const settings = useSelector(state => state.settings);
    const applications_list = useSelector(state => state.applications);

    let default_group = props.application.get_default_channel_group().group_name;
    const [selected, set_selected] = useState({label:default_group, value:default_group});

    const store = useStore();

    const [application, ] = useState(applications_list[settings['application']])
    const [channelGroups, ] = useState(applications_list[settings['application']]['channel_groups']);
    const [group_options, ] = useState(channelGroups.map((group,i) => (
        {label:group.group_name, value:group.group_name}
    )));
    const [scope_mux_address, ] = useState(parseInt(applications_list[settings['application']]['miscellaneous']['scope_mux_address']));

    let handleChGroupChange = useCallback((object) => {
        let group_name = object.value;
        set_selected(object);
        let group = []
        //GET GROUP OBJECT
        for(let item of application.channel_groups){
            if(item.group_name === group_name) {
                group = item;
            }
        }
        //GET SET UP PLOT WITH NEW CHANNELS

        let channels = get_channels_from_group(group, application.channels);
        props.on_group_change(group)

        //SET UP MUXES FOR NEW GROUP
        props.application.setup_scope_mux(channels);

        // TODO: take this stuff out of here and push it to the plot helper in core lib
        //SET  UP CHANNEL WIDTHS
        let sfs = Array(6).fill(1);

        for(let item of channels){
            if(item.scaling_factor){
                sfs[parseInt(item.number)] = parseFloat(item.scaling_factor);
            }
        }

        set_scaling_factors(sfs).then();

        // SET NEW CHANNELS status
        let new_ch_state = {}

        store.getState().plot.data.map(chan => {
            new_ch_state[chan.spec.number] = chan.visible;
            return 0;
        })
        set_channel_status(new_ch_state);
    }, [application, scope_mux_address, store]);

    return (
        <div style={{padding:"1rem"}}>
            <FormLayout>
                <SelectField
                    label="Channel Group"
                    name="channel_group"
                    onChange={handleChGroupChange}
                    options={group_options}
                    value={selected}
                />
            </FormLayout>
        </div>
    );
};

export default EnablesProperties;
