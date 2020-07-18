import React from "react";


import {InputField} from "../InputField";

export let  ScriptProperties = props =>{


    let handleonKeyDown = (event) =>{
        let edit = {}
        if(event.key==="Enter"|| event.key ==="Tab"){
            edit = {script:props.script, field:event.target.name, value:event.target.value}
            props.server.script_proxy.edit_script(edit);
        }
    }

    return(
        <InputField inline name={props.field_name} placeholder={props.field_value} onKeyDown={handleonKeyDown} label={props.field_name}/>
    );
};