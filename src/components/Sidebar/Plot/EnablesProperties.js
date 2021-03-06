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
import {useDispatch, useSelector} from "react-redux";

import {
    Button, FormLayout,
    InputField, Label, Select,
    SidebarBlockLayout,
    SidebarBlockTitleLayout} from "../../UI_elements";

import styled from "styled-components";
import {create_plot_channel, get_channels_from_group} from "../../../utilities/PlotUtilities";
import {initialize_channels} from "../../../redux/Actions/plotActions";
import {setSetting} from "../../../redux/Actions/SettingsActions";

const ChoicesWrapper = styled.div`
    display: grid;
    grid-template-columns: repeat(2, auto);
    grid-gap: 0.3rem;
    justify-content: space-between;
    align-items: start;
`


let  EnablesProperties = props =>{
    const dispatch = useDispatch();
    const settings = useSelector(state => state.settings);
    const applications_list = useSelector(state => state.applications);
    const channels_data = useSelector(state => state.plot.data);
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
        let bulk_registers = [];

        let reg_offset = peripheral_specs['enable_generator_1'].registers.filter((reg)=>{
            return reg.ID === "freq";
        })[0].offset;
        let address = parseInt(timebase_addr)+parseInt(reg_offset);
        bulk_registers.push({address:address, value:sample_period})

        reg_offset = peripheral_specs['enable_generator_1'].registers.filter((reg)=>{
            return reg.ID === "pha_1";
        })[0].offset;
        address = parseInt(timebase_addr)+parseInt(reg_offset);
        bulk_registers.push({address:address, value:sample_phase})
        settings.server.periph_proxy.bulkRegisterWrite({payload:bulk_registers});
    }

    let handleChGroupChange = (event) => {
        let group_name = event.target.value;
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
            let components = [];
            for(let item of channels){
                let channel_mux = parseInt(item.mux_setting)<<4*item.number;
                components.push(channel_mux);
            }
            let word = 0x1000000;
            for(let item of components){
                word |= item;
            }
            settings.server.periph_proxy.bulkRegisterWrite({payload:[{address:scope_mux_address, value:word}]});
        }
        //SET  UP CHANNEL WIDTHS
        let widths = []
        for(let item of channels){
            widths.push(parseInt(item.phys_width));
        }
        settings.server.plot_proxy.set_channel_widths(widths);
        // SET NEW CHANNELS status
        let new_ch_state = {}

        channels_data.map(chan => {
            new_ch_state[chan.spec.number] = chan.visible;
            return 0;
        })
        settings.server.plot_proxy.set_channel_status(new_ch_state);
    };

    return (
        <SidebarBlockLayout padding={'1rem'}>
            <SidebarBlockTitleLayout>
                <label style={{fontSize:'20px',fontWeight:600}}>{"Scope Sampling Settings"}</label>
            </SidebarBlockTitleLayout>

                <form onSubmit={handle_submit}>
                    <FormLayout>
                        <InputField inline name='frequency' label="Frequency"/>
                        <InputField inline name={'phase'} label={'Phase'}/>
                        <ChoicesWrapper>
                            <Label>Channel Group</Label>
                            <Select name="channel_group" defaultValue={settings.default_ch_group.group_name} onChange={handleChGroupChange}>
                                {
                                    channelGroups.map((group,i) => (
                                        <option key={i} >{group.group_name}</option>
                                    ))
                                }
                            </Select>
                        </ChoicesWrapper>
                        <Label>Effective Sampling frequency: {settings.sampling_period}</Label>
                        <Button type='submit' >Submit changes</Button>
                    </FormLayout>
                </form>

        </SidebarBlockLayout>
    );
};

export default EnablesProperties;
