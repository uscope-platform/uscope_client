import React from "react";
import {InputField} from "../InputField";

export let  BitstreamProperties = props =>{


    let handleonKeyDown = (event) =>{
        let edit = {}
        if(event.key==="Enter"|| event.key ==="Tab"){
            edit = {id:props.bitstream, field:{name:event.target.name, value:event.target.value}}
            props.server.bitstream_proxy.edit_bitstream(edit);
        }
    }

    return(
        <InputField inline name={props.field_name} placeholder={props.field_value} onKeyDown={handleonKeyDown} label={props.field_name}/>
    );
};