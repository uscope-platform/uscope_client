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
import {ConstantInputProperties, SeriesInputProperties, ExternalInputProperties, WaveformInputProperties} from "./inputs";
import TypeOptionsContainer from "./TypeOptionsContainer";

let  CoreInputProperties = props =>{

    const [, forceUpdate] = useReducer(x => x + 1, 0);

    let [selected_channel, set_selected_channel] = React.useState(0);

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

    let handle_source_change = (field, value) =>{
        let new_value = value;
        let waveform_peripherals = ["von", "voff", "tdelay", "ton", "period", "dc_offset", "amplitude", "frequency", "phase", "duty", "value"]
        if(waveform_peripherals.includes(field)){
            new_value = JSON.parse(JSON.stringify(sel_in.source[field]));
            new_value[selected_channel] = value;
        }
        let new_source = {...sel_in.source, ...{[field]:new_value}};
        props.selected_emulator.edit_input(props.selected_component.obj.id, "source", new_source, props.selected_iom.obj).then(()=>{
            forceUpdate();
        });
    }

    let render_source_dependent_options = () =>{
        let ret = []
        if(sel_in.source){
            if(sel_in.source.type==="constant"){
                ret.push(
                    <ConstantInputProperties
                        input={sel_in.source}
                        channel={selected_channel}
                        onChange={handle_source_change}
                    />
                )
            } else if(sel_in.source.type==="series"){
                ret.push(
                    <SeriesInputProperties
                        input={sel_in.source}
                        channel={selected_channel}
                        selected_core={props.selected_core}
                        onChange={handle_source_change}
                    />
                )
            } else if(sel_in.source.type==="external"){
                ret.push(
                    <ExternalInputProperties
                        input={sel_in.source}
                        channel={selected_channel}
                        onChange={handle_source_change}
                    />
                )
            } else if(sel_in.source.type==="waveform"){
                ret.push(
                    <WaveformInputProperties
                        input={sel_in.source}
                        channel={selected_channel}
                        onChange={handle_source_change}
                    />
                )
            }
        }
        return ret;
    }

    let get_channels_list = () =>{
        let channels_idx = Array.from({ length: props.selected_core.channels }, (_, i) => i );
        let res = channels_idx.map((index) =>{
            return {label: index, value: index}
        })
        return res;
    }

    if(sel_in){
        return(
            <SimpleContent name="Input Properties">
                <div key="input_props" style={{maxHeight:"13em"}}>
                    <InputField id="name" name="name" label="Name" defaultValue={sel_in.name} onKeyDown={handle_change_iom}/>
                    <SelectField
                        inline
                        key="channel_selector"
                        label="Channel Selection"
                        onChange={(obj, e) =>{
                            set_selected_channel(obj.value);
                        }}
                        value={{value: selected_channel, label: selected_channel}}
                        defaultValue="Channel Selection"
                        name="channel_selector"
                        options={get_channels_list()}
                    />
                    <TypeOptionsContainer label="Source Properties">
                        <SelectField
                            inline
                            key="source_type"
                            label="Type"
                            onChange={handle_select}
                            value={{value: sel_in.source.type, label: sel_in.source.type}}
                            defaultValue="Select Type"
                            name="source_type"
                            options={[
                                {label: "constant", value: "constant"},
                                {label: "series", value: "series"},
                                {label: "random", value: "random"},
                                {label: "external", value:"external"},
                                {label: "Waveform", value: "waveform"}
                            ]}
                        />
                        {render_source_dependent_options()}
                    </TypeOptionsContainer>
                    <TypeOptionsContainer label="Input data format">
                        {render_type_options()}
                    </TypeOptionsContainer>
                </div>
            </SimpleContent>
        )
    }


};

export default CoreInputProperties;
