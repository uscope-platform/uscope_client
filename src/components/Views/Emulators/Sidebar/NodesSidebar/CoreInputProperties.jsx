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
import {InputField, SelectField, SimpleContent} from "../../../../UI_elements";

let  CoreInputProperties = props =>{

    const [, forceUpdate] = useReducer(x => x + 1, 0);

    let sel_in = props.selected_core.inputs.filter((item)=>{
        return item.name === props.selected_iom.obj
    })[0];


    let handle_change_iom = (event) =>{
        if(event.key==="Enter"|| event.key ==="Tab") {
            let field = event.target.name;
            let value = event.target.value;

            if(field === "reg_n" || field === "channel"){
                value = value.replace(/\s/g, '');
                let value_tokens = value.split(",")
                value = value_tokens.map(val =>{
                    return parseInt(val);
                })
            }
            if(field === "constant_value") {
                field = "source";
                if(sel_in.source.type === "constant") {
                    value = value.replace(/\s/g, '');
                    let value_tokens = value.split(",")
                    value = value_tokens.map(val =>{
                        return parseFloat(val);
                    })
                }
                value = {...sel_in.source, ...{"value":value}};
            }

            props.selected_emulator.edit_input(props.selected_component.obj.id,
                field, value, props.selected_iom.obj).then(()=>{
                if(field === 'name'){
                    props.on_modify({type:props.selected_iom.type, obj:value});
                }
                forceUpdate();
            });
        }
    };

    let handle_select = (obj, e) =>{
        let field = e.name;
        let value = obj.value;
        if(e.name === "source_type"){
            field = "source"
            value = {...sel_in.source, ...{"type":value}};
        }
        if(field === "source_value") {
            field = "source";
            value = {...sel_in.source, ...{"value":value}};
        }
        props.selected_emulator.edit_input(props.selected_component.obj.id,
            field, value, props.selected_iom.obj).then(()=>{
            forceUpdate();
        });
    }

    let render_vector_input_properties = () =>{
        if(sel_in.register_type==="vector" || sel_in.register_type==="explicit_vector"){
            return <InputField id="labels" name="labels" label="Labels" defaultValue={sel_in.labels} onKeyDown={handle_change_iom}/>
        }
    }

    let render_source_options = () => {
        let ret = []
        ret.push(
            <SelectField
                inline
                key="source_type"
                label="Input Type"
                onChange={handle_select}
                value={{value: sel_in.source.type, label: sel_in.source.type}}
                defaultValue="Select Input Type"
                name="source_type"
                options={[
                    {label: "constant", value: "constant"},
                    {label: "file", value: "file"},
                    {label: "external", value:"external"}
                ]}
            />
        )
        if(sel_in.source){
            if(sel_in.source.type==="constant") {
                ret.push(
                    <InputField
                        Inline
                        key={"constant_value" + String(sel_in.source.value)}
                        id="constant_value"
                        name="constant_value"
                        label="Value"
                        defaultValue={sel_in.source.value}
                        onKeyDown={handle_change_iom}
                    />
                )
            }else if(sel_in.source.type==="file"){
                let files = props.selected_core.input_data.map((item)=>{
                    return Object.keys(item.data).map((name)=>{
                        return {label:item.name + "." + name, value:item.name + "." + name};
                    })
                }).flat();

                ret.push(<SelectField
                    inline
                    key="source_value"
                    label="Data Series"
                    onChange={handle_select}
                    value={{value: sel_in.source.value, label: sel_in.source.value}}
                    defaultValue="Select data series"
                    name="source_value"
                    options={files}
                />)
            }
        }
        return(ret);
    }
    if(sel_in){
        return(
            <SimpleContent name="Input Properties" content={
                <div key="input_props">
                    <InputField id="name" name="name" label="Name" defaultValue={sel_in.name} onKeyDown={handle_change_iom}/>
                    <InputField id="channel" name="channel" label="Channel" defaultValue={sel_in.channel} onKeyDown={handle_change_iom}/>
                    <InputField id="reg_n" name="reg_n" label="Register #" defaultValue={sel_in.reg_n} onKeyDown={handle_change_iom}/>
                    <SelectField
                        inline
                        label="Data Type"
                        onChange={handle_select}
                        value={{value: sel_in.type, label: sel_in.type}}
                        defaultValue="Select Data Type"
                        name="type"
                        options={[
                            {label: "float", value: "float"},
                            {label: "integer", value: "integer"}
                        ]}
                    />
                    <SelectField
                        inline
                        label="Register Type"
                        onChange={handle_select}
                        value={{value: sel_in.register_type, label: sel_in.register_type}}
                        defaultValue="Select Register Type"
                        name="register_type"
                        options={[
                            {label: "scalar", value: "scalar"},
                            {label: "vector", value: "vector"},
                            {label: "explicit_vector", value: "explicit_vector"}
                        ]}
                    />
                    {render_source_options()}
                    {render_vector_input_properties()}
                </div>
            }/>
        )
    }


};

export default CoreInputProperties;
