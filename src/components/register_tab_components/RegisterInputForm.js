import React from 'react';

import {Form, Button} from "react-bootstrap";

import SingleValueField from "../Common_Components/SingleValueField";
import TwoValuesField from "../Common_Components/TwoValuesField";

function arraysEqual(a,b) {
    /*
        Array-aware equality checker:
        Returns whether arguments a and b are == to each other;
        however if they are equal-lengthed arrays, returns whether their
        elements are pairwise == to each other recursively under this
        definition.
    */
    if (a instanceof Array && b instanceof Array) {
        // eslint-disable-next-line
        if (a.length!=b.length)
            return false;
        for(var i=0; i<a.length; i++)  // assert each element equal
            if (!arraysEqual(a[i],b[i]))
                return false;
        return true;
    } else {
        // eslint-disable-next-line
        return a==b;  // if not both arrays, should be the same
    }
}

let RegisterInputForm  = props => {



    const handleSubmit = event => {
        event.preventDefault();
        let first_field_value = null;
        for(let register of event.target){ // eslint-disable-line no-unused-vars
            if(register.className.includes("oneField")){
                let idx = props.registers.findIndex((obj => obj.register_name === register.name));
                let intValue = parseFloat(register.value);
                if(register.value!=="" && props.registers[idx].value !==intValue){
                    props.server.periph_proxy.setRegisterValue({name:register.name, peripheral:props.content.tab_id, value:intValue})
                }
            }else if (register.className.includes("twoFields")){
                for(let item of register.classList){ // eslint-disable-line no-unused-vars
                    if(item.includes("twoFields")){
                        let reg_id = register.id.split('.')[0];
                        let reg_idx = props.registers.findIndex((obj => obj.register_name === reg_id));
                        let fld_idx = parseInt(item.replace("twoFields.",''));
                        let currentValue = parseInt(register.value);
                        if(fld_idx===1){
                            first_field_value = currentValue;
                        }else if(fld_idx===2){
                            currentValue = [first_field_value, currentValue];
                            if(register.value!=="" && !arraysEqual( props.registers[reg_idx].value, currentValue)) {
                                props.server.periph_proxy.setRegisterValue({name:reg_id, peripheral:props.content.tab_id, value:currentValue[0]+(currentValue[1]<<16)});
                            }
                        }

                    }
                }

            }
        }
    };



    let generate_field = (reg, i, preview) => {
        let reg_value = 0;
        if(!preview){
            reg_value = props.values[reg.register_name];
        }
        if(reg.register_format === "single"){
            return(
                <SingleValueField key={i} name={reg.register_name} value={reg_value} description={reg.description} preview_only={preview} handle_remove={props.handle_remove}/>
            );
        } else if(reg.register_format === "complex"){
            return(
                <SingleValueField key={i} name={reg.register_name} value={reg_value} description={reg.description} preview_only={preview} handle_remove={props.handle_remove}/>
            );
        } else if(reg.register_format==='words'){
            let split_values = [(reg_value & 0x0000ffff), (reg_value & 0xffff0000) >> 16];
            return(
                <TwoValuesField key={i} field_names={reg.field_names} register_name={reg.register_name} value={split_values} field_descriptions={reg.field_descriptions} preview_only={preview} handle_remove={props.handle_remove}/>
            );
        } else return(<p>invalid form field</p>);
    };


    if(!props.preview_only){
        return(
            <Form onSubmit={handleSubmit}>
                {props.registers.map((reg, i) => {
                    return generate_field(reg, i, false)
                })}
                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
        );
    } else{
        return(
            <>
                {props.registers.map((reg, i) => {
                    return generate_field(reg, i, true)
                })}
            </>
        );
    }

};

export default RegisterInputForm;
