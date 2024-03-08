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

import React, {useState} from 'react';
import {useDispatch, useSelector, useStore} from "react-redux";

import {
    Button, FormLayout,
    InputField, Label, SelectField
} from "../../UI_elements";

import {initialize_channels} from "../../../redux/Actions/plotActions";
import {setSetting} from "../../../redux/Actions/SettingsActions";
import {
    set_channel_widths,
    set_channel_status,
    up_peripheral,
    create_plot_channel,
    get_channels_from_group,
    set_channel_signs,
    set_scaling_factors
} from "../../../client_core";



let  EnablesProperties = props =>{

    const dispatch = useDispatch();
    const settings = useSelector(state => state.settings);
    const applications_list = useSelector(state => state.applications);


    const store = useStore();

    const [application, ] = useState(applications_list[settings['application']])
    const [timebase_addr, ] = useState(applications_list[settings['application']]['timebase_address']);
    const [channelGroups, ] = useState(applications_list[settings['application']]['channel_groups']);
    const [scope_mux_address, ] = useState(parseInt(applications_list[settings['application']]['scope_mux_address']));

    const peripheral_specs = useSelector( state => state.peripherals);

    let parse_number = (raw_value) => {
        let numeric_value = 0;
        if(isNaN(parseFloat(raw_value[raw_value.length -1]))){
            numeric_value = raw_value.slice(0,raw_value.length-1);
            switch (raw_value[raw_value.length-1]) {
                case 'M':
                    numeric_value = numeric_value*1e6;
                    break;
                case 'k':
                case 'K':
                    numeric_value = numeric_value*1e3;
                    break;
                case 'm':
                    numeric_value = numeric_value*1e-3;
                    break;
                case 'u':
                case 'U':
                    numeric_value = numeric_value*1e-6;
                    break;
                default:
                    break;
            }
        } else{
            numeric_value = parseFloat(raw_value);
        }
        let divisor = Math.round(Math.ceil(60e3/numeric_value));
        let sample_time = 60e3/divisor;
        dispatch(setSetting(["sampling_period", sample_time]));
        return divisor;

    };

    let handle_submit = (event) =>{
        event.preventDefault();
        let sample_period = parse_number(event.target.frequency.value);
        let sample_phase = Math.round(1);
        let writes = [];

        let reg_offset = peripheral_specs['enable_generator_1'].registers.filter((reg)=>{
            return reg.ID === "freq";
        })[0].offset;
        let address = parseInt(timebase_addr)+parseInt(reg_offset);
        writes.push([address, sample_period])

        reg_offset = peripheral_specs['enable_generator_1'].registers.filter((reg)=>{
            return reg.ID === "pha_1";
        })[0].offset;
        address = parseInt(timebase_addr)+parseInt(reg_offset);
        writes.push([address, sample_phase])
        up_peripheral.direct_register_write(writes).then();
    }

    let handleChGroupChange = (event) => {
        let group_name = event.value;
        set_selected(event.target);
        let group = []
        //GET GROUP OBJECT
        for(let item of application.channel_groups){
            if(item.group_name === group_name) {
                group = item;
            }
        }
        //GET SET UP PLOT WITH NEW CHANNELS
        let channels = get_channels_from_group(group, application.channels);
        let ch_obj = [];
        for(let item of channels){
            ch_obj.push(create_plot_channel(item))
        }
        dispatch(initialize_channels(ch_obj));
        //SET UP MUXES FOR NEW GROUP
        if(scope_mux_address){
            for(let item of channels){
                if(item){
                    let channel_address = scope_mux_address + 4*(parseInt(item.number)+1);
                    up_peripheral.direct_register_write([[channel_address, parseInt(item.mux_setting)]]).then();
                }
            }
        }
        //SET  UP CHANNEL WIDTHS
        let widths = Array(6).fill(16);
        let sfs = Array(6).fill(1);
        let signs = Array(6).fill(true);

        for(let item of channels){
            if(item.phys_width){
                widths[parseInt(item.number)] = parseInt(item.phys_width);
            }
            if(item.scaling_factor){
                sfs[parseInt(item.number)] = parseFloat(item.scaling_factor);
            }
            if(item.signed !== undefined && item.signed !== null){
                signs[parseInt(item.number)] = item.signed;
            }
        }

        set_channel_widths(widths).then();
        set_scaling_factors(sfs).then();
        set_channel_signs(signs).then();

        // SET NEW CHANNELS status
        let new_ch_state = {}

        store.getState().plot.data.map(chan => {
            new_ch_state[chan.spec.number] = chan.visible;
            return 0;
        })
        set_channel_status(new_ch_state);
    };

    let ch_groups = channelGroups.map((group,i) => (
        {label:group.group_name, value:group.group_name}
    ));

    const [selected, set_selected] = useState({label:settings.default_ch_group.group_name, value:settings.default_ch_group.group_name});

    return (
        <div style={{padding:"1rem"}}>
            <form onSubmit={handle_submit}>
                <FormLayout>
                    <InputField inline name='frequency' label="Frequency"/>
                    <InputField inline name={'phase'} label={'Phase'}/>
                    <SelectField
                        label="Channel Group"
                        name="channel_group"
                        onChange={handleChGroupChange}
                        options={ch_groups}
                        value={selected}
                    />
                    <Label>Effective Sampling frequency: {settings.sampling_period}</Label>
                    <Button type='submit' >Submit changes</Button>
                </FormLayout>
            </form>
        </div>
    );
};

export default EnablesProperties;
