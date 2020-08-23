import React from "react";
import {InputField} from "../InputField";

export let  ProgramProperties = props =>{


    let handleonKeyDown = (event) =>{
        let edit = {}
        if(event.key==="Enter"|| event.key ==="Tab"){
            edit = {program:props.program, field:event.target.name, value:event.target.value}
            props.server.prog_proxy.edit_program(edit);
        }
    }

    return(
        <InputField inline name={props.field_name} placeholder={props.field_value} onKeyDown={handleonKeyDown} label={props.field_name}/>
    );
};