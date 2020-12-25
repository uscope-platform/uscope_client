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
    const [application, ] = useState(applications_list[settings['application']])
    const [clock_frequency, ] = useState(applications_list[settings['application']]['clock_frequency']);
    const [timebase_addr, ] = useState(applications_list[settings['application']]['timebase_address']);
    const [channelGroups, ] = useState(applications_list[settings['application']]['channel_groups']);
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
        return Math.round(clock_frequency/numeric_value)

    };

    let handle_submit = (event) =>{
        event.preventDefault();
        let sample_period = parse_number(event.target.frequency.value);
        let sample_phase = Math.round(parseFloat(event.target.phase.value)*sample_period);
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
        debugger;
        let group_name = event.target.value;
        let group = []
        for(let item of application.channel_groups){
            if(item.group_name === group_name) {
                group = item;
            }
        }
        let channels = get_channels_from_group(group, application.channels);
        let ch_obj = [];
        for(let item of channels){
            ch_obj.push(create_plot_channel(item))
        }

        dispatch(initialize_channels(ch_obj));
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
                        <Button type='submit' >Submit changes</Button>
                    </FormLayout>
                </form>

        </SidebarBlockLayout>
    );
};

export default EnablesProperties;
