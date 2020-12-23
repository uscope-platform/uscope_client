import React, {useState} from 'react';
import {useSelector} from "react-redux";

import {
    Button, FormLayout,
    InputField,
    SidebarBlockLayout,
    SidebarBlockTitleLayout
} from "../../UI_elements";


let  EnablesProperties = props =>{
    const settings = useSelector(state => state.settings);
    const applications = useSelector(state => state.applications);

    const [clock_frequency, ] = useState(applications[settings['application']]['clock_frequency']);
    const [timebase_addr, ] = useState(applications[settings['application']]['timebase_address']);
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

    return (
        <SidebarBlockLayout padding={'1rem'}>
            <SidebarBlockTitleLayout>
                <label style={{fontSize:'20px',fontWeight:600}}>{"Scope Sampling Settings"}</label>
            </SidebarBlockTitleLayout>

                <form onSubmit={handle_submit}>
                    <FormLayout>
                        <InputField inline name='frequency' label="Frequency"/>
                        <InputField inline name={'phase'} label={'Phase'}/>
                        <Button type='submit' >Submit changes</Button>
                    </FormLayout>
                </form>

        </SidebarBlockLayout>
    );
};

export default EnablesProperties;
