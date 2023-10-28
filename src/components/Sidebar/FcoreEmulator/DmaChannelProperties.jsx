// Copyright 2023 Filippo Savi
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

import React, {useReducer} from 'react';

import {InputField, SelectField} from "../../UI_elements";
import {useDispatch} from "react-redux";
import {setSetting} from "../../../redux/Actions/SettingsActions";
import Select from "react-select";

let  DmaChannelProperties = props =>{

    const dispatch = useDispatch();

    const [, forceUpdate] = useReducer(x => x + 1, 0);

    let handle_change = (event) =>{
        if(event.key==="Enter"|| event.key ==="Tab") {
            let field = event.target.name;
            let value = event.target.value;

            if(field.includes("source") || field.includes("target")){
                let split_field = field.split("_");
                if(split_field[0] === 'source'){
                    value = props.selected_channel.source;
                    value[split_field[1]] = parseInt(event.target.value);
                } else {
                    value = props.selected_channel.target;
                    value[split_field[1]] = parseInt(event.target.value);
                }
                field = split_field[0];
            }

            if(field === "length" || field === "stride"){
                value = parseInt(value);
            }

            props.selected_emulator.edit_dma_channel(props.source_core, props.target_core,
                field, value, props.selected_channel.name).then(()=>{
                if(field === 'name'){
                    dispatch(setSetting(["emulator_selected_dma_channel", value]));
                }
                forceUpdate();
            });
        }
    }

    let handle_change_type = (value) =>{
        props.selected_emulator.edit_dma_channel(props.source_core, props.target_core,
            "type", value.value, props.selected_channel.name).then(()=>{
            forceUpdate();
        });
    }

    let plot_vector_transfer_props = () =>{
        let ret = [];

        if(props.selected_channel.type !== "scalar_transfer")
            ret.push(<InputField  ID="length" name="length" label="Length" defaultValue={props.selected_channel.length} onKeyDown={handle_change}/>);
        if(props.selected_channel.type ==="2d_vector_transfer")
            ret.push(<InputField ID="stride" name="stride" label="Stride" defaultValue={props.selected_channel.stride} onKeyDown={handle_change}/>)

        return ret;
    }


    return(
        <div key="dma_channel_props">
            <InputField ID="name" name="name" label="Name" defaultValue={props.selected_channel.name} onKeyDown={handle_change}/>
            <SelectField
                inline
                label="Type"
                onChange={handle_change_type}
                value={{value: props.selected_channel.type, label: props.selected_channel.type}}
                defaultValue="Select Type"
                name="type"
                options={[
                    {label: "scalar_transfer", value: "scalar_transfer"},
                    {label: "scatter_transfer", value: "scatter_transfer"},
                    {label: "vector_transfer", value: "vector_transfer"},
                    {label: "gather_transfer", value: "gather_transfer"},
                    {label: "2d_vector_transfer", value: "2d_vector_transfer"}
                ]}
            />
            {plot_vector_transfer_props()}
            <InputField ID="source_channel" name="source_channel" label="Source Channel" defaultValue={props.selected_channel.source.channel} onKeyDown={handle_change}/>
            <InputField ID="source_register" name="source_register" label="Source Register" defaultValue={props.selected_channel.source.register} onKeyDown={handle_change}/>
            <InputField ID="target_channel" name="target_channel" label="Target Channel" defaultValue={props.selected_channel.target.channel} onKeyDown={handle_change}/>
            <InputField ID="target_register" name="target_register" label="Target Register" defaultValue={props.selected_channel.target.register} onKeyDown={handle_change}/>
        </div>
    )

};

export default DmaChannelProperties;
