import React, {useState} from 'react';

import {useDispatch, useSelector} from "react-redux";


import {
    Button,
    FormLayout,
    InputField,
    SidebarBlockLayout,
    SidebarBlockTitleLayout,
    SidebarContentLayout, StyledScrollbar
} from "../../UI_elements";
import {saveScriptsWorkspace} from "../../../redux/Actions/scriptsActions";


let  PlotSidebar = props =>{
    let dispatch = useDispatch;
    const  applications = useSelector(state => state.applications);
    const settings = useSelector(state => state.settings);

    const [n_enables, ] = useState(applications[settings['application']]['n_enables']);
    const [enable_values, set_enable_values] = useState(Array(applications[settings['application']]['n_enables']));
    const [clock_frequency, ] = useState(applications[settings['application']]['clock_frequency']);

    let handle_change = (event) =>{

        let new_enable_vals = enable_values;
        new_enable_vals[event.target.name] = event.target.value;
        set_enable_values(new_enable_vals);
    }

    let handle_close = (event) =>{
        let value = clock_frequency.replace(' ', '');

        let timebase_reg = {};
        timebase_reg['name'] = 'freq';
        timebase_reg['peripheral'] = 'enable_generator';
        timebase_reg['value'] = parse_number(value);

        let phases = Array.from({length: n_enables}, (x,i) => i).map((reg, i) => {
            let ret_val = {};
            ret_val['name'] = 'pha_'+(i+1);
            ret_val['peripheral'] = 'enable_generator';
            ret_val['value'] = Math.round(parseFloat(enable_values[i].replace(' ', ''))*timebase_reg.value);
            return ret_val;
        });

        settings.server.periph_proxy.setRegisterValue(timebase_reg);

        // eslint-disable-next-line
        for(let i of phases){
            settings.server.periph_proxy.setRegisterValue(i);
        }
    }

    let parse_number = (raw_value) =>{
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

            numeric_value = Math.round(clock_frequency/parseFloat(raw_value));
        }
        dispatch(saveScriptsWorkspace({fsw:parseFloat(raw_value)}));
        return numeric_value

    };

    return (
        <SidebarContentLayout peripheral>
            <SidebarBlockLayout>
                <SidebarBlockTitleLayout>
                    <label style={{fontSize:'20px',fontWeight:600}}>{"Registers"}</label>
                </SidebarBlockTitleLayout>
                <StyledScrollbar>
                    <FormLayout>
                        <InputField inline name='frequency' onChange={handle_change} label="Frequency"/>
                        {
                            Array.from({length:n_enables}, (x,i) => i).map((reg, i) => {
                                return <InputField inline name={i} onChange={handle_change} label={'enable_'+(i+1)}/>
                            })
                        }
                    </FormLayout>
                    <Button onClick={handle_close}>Save changes</Button>
                </StyledScrollbar>
            </SidebarBlockLayout>
        </SidebarContentLayout>
    );

};

export default PlotSidebar;
