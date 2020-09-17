import React, {useState} from 'react';
import store from "../../../store";
import {useDispatch, useSelector} from "react-redux";

import {
    Button, FormLayout,
    InputField,
    SidebarBlockLayout,
    SidebarBlockTitleLayout
} from "../../UI_elements";

import {saveScriptsWorkspace} from "../../../redux/Actions/scriptsActions";

// THIS HACK IS NEEDED BECAUSE useDispatch IS THROWING A FIT IN THIS CASE FOR SOME REASON
// I SUSPECT A BUG
let dispatchSaveWorkspace = workspace =>{
    store.dispatch(saveScriptsWorkspace(workspace))
}

let  EnablesProperties = props =>{
    const settings = useSelector(state => state.settings);
    const applications = useSelector(state => state.applications)

    const [n_enables, ] = useState(applications[settings['application']]['n_enables']);
    const [clock_frequency, ] = useState(applications[settings['application']]['clock_frequency']);

    let parse_number = (raw_value) => {
        let numeric_value = 0;
        if(isNaN(parseFloat(raw_value[raw_value.length -1]))){
            debugger;
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
        return numeric_value

    };

    let handle_submit = (event) =>{
        event.preventDefault();
        let timebase_reg = {};
        timebase_reg['name'] = 'freq';
        timebase_reg['peripheral'] = 'enable_generator';
        let workspace = {fsw:parseFloat(event.target.frequency.value)}
        dispatchSaveWorkspace(workspace);
        timebase_reg['value'] = parse_number(event.target.frequency.value);
        let phases = [...event.target.elements].slice(1,-1).map((reg, i) => {
            debugger;
            let ret_val = {};
            ret_val['name'] = 'pha_'+(i+1);
            ret_val['peripheral'] = 'enable_generator';
            ret_val['value'] = Math.round(parseFloat(reg.value.replace(' ', ''))*timebase_reg.value);
            return ret_val;
        });
        settings.server.periph_proxy.setRegisterValue(timebase_reg);

        // eslint-disable-next-line
        for(let i of phases){
            settings.server.periph_proxy.setRegisterValue(i);
        }
    };

    return (
        <SidebarBlockLayout padding={'1rem'}>
            <SidebarBlockTitleLayout>
                <label style={{fontSize:'20px',fontWeight:600}}>{"Timebase Settings"}</label>
            </SidebarBlockTitleLayout>

                <form onSubmit={handle_submit}>
                    <FormLayout>
                        <InputField inline name='frequency' label="Frequency"/>
                        {
                            Array.from({length:n_enables}, (x,i) => i).map((reg, i) => {
                                return <InputField inline name={'pha_'+(i+1)} label={'enable_'+(i+1)}/>
                            })
                        }
                        <Button type='submit' >Submit changes</Button>
                    </FormLayout>
                </form>

        </SidebarBlockLayout>
    );
};

export default EnablesProperties;
