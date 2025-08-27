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
import {Checkbox, InputField, SelectField, SimpleContent} from "@UI";

let  CoreInputProperties = props =>{

    const [, forceUpdate] = useReducer(x => x + 1, 0);

    let sel_in = props.selected_core.inputs.filter((item)=>{
        return item.name === props.selected_iom.obj
    })[0];


    let handle_change_iom = (event) =>{
        if(event.key==="Enter"|| event.key ==="Tab") {
            let field = event.target.name;
            let value = event.target.value;

            if(field === "width" || field === "vector_size"){
                value = parseInt(value);
            }

            if(field === "constant_value" || field === "initial_value") {
                field = "source";
                if(sel_in.source.type === "constant" || sel_in.source.type === "external") {
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

    let handle_change_signed = (event) =>{
        let field = event.target.name;
        let value = event.target.checked;

        props.selected_emulator.edit_input(props.selected_component.obj.id,
            field, value, props.selected_iom.obj).then(()=>{
            forceUpdate();
        });
    }

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
                    {label: "series", value: "series"},
                    {label: "random", value: "random"},
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
            }else if(sel_in.source.type==="series"){
                let files = props.selected_core.input_data.map((item)=>{
                    return Object.keys(item.data).map((name)=>{
                        let label = name.split("[")[0];
                        return {label:item.name + "." + label, value:item.name + "." + label};
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
            } else if(sel_in.source.type==="external"){
                ret.push(
                    <InputField
                        Inline
                        key={"initial_value" + String(sel_in.source.value)}
                        id="initial_value"
                        name="initial_value"
                        label="Initial Value"
                        defaultValue={sel_in.source.value}
                        onKeyDown={handle_change_iom}
                    />
                )
            }
        }
        return(ret);
    }

    let render_type_options = () =>{
        let ret = [
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
        ];

        if(sel_in.type==="integer"){
            ret.push(<InputField id="width" name="width" label="Input width" defaultValue={sel_in.width} onKeyDown={handle_change_iom}/>);
            ret.push(<Checkbox name='signed' value={sel_in.signed} onChange={handle_change_signed} label="Signed"/>);
        }

        ret.push(<Checkbox name='common_io' value={sel_in.common_io} onChange={handle_change_signed} label="Common IO"/>);
        ret.push(<Checkbox name='is_vector' value={sel_in.is_vector} onChange={handle_change_signed} label="Is Vector"/>);
        if(sel_in.is_vector){
            ret.push(<InputField id="vector_size" name="vector_size" label="Vector Size" defaultValue={sel_in.vector_size} onKeyDown={handle_change_iom}/>);
        }
        return ret;
    }

    if(sel_in){
        return(
            <SimpleContent  name="Input Properties" content={
                <div key="input_props" style={{maxHeight:"13em"}}>
                    <InputField id="name" name="name" label="Name" defaultValue={sel_in.name} onKeyDown={handle_change_iom}/>
                    {render_type_options()}
                    {render_source_options()}
                </div>
            }/>
        )
    }


};

export default CoreInputProperties;
