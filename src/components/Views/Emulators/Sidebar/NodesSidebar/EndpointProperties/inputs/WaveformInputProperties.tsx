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

import React from 'react';
import {InputField, SelectField} from "#UI/index.js";
import type {core_input_source, SimpleStringOption} from "#interfaces/index.js";
import type {ActionMeta} from "react-select";

interface WaveformInputPropertiesProps {
    input: core_input_source,
    channel: number,
    onChange: (field: string, value: number | number[]) => void,
}

export let WaveformInputProperties = (props:WaveformInputPropertiesProps) =>{

    let handle_select = (obj: SimpleStringOption| null, e: ActionMeta<SimpleStringOption>) =>{
        let field = e.name;
        if(!obj || field == undefined) return;
        let value = obj.value;
        props.onChange(field, parseFloat(value));
    }

    let format_value = (value: number | undefined) =>{
        if(value === undefined){
            return "";
        }
        if(value === 0){
            return "0";
        }
        if(Math.abs(value) < 1e-9) {
            return (value * 1e12).toFixed(2)+ "p";
        }else if(Math.abs(value) < 1e-6){
            return (value * 1e9).toFixed(2) + "n";
        } else if(Math.abs(value) < 1e-3){
            return (value * 1e6).toFixed(2) + "µ";
        } else if(Math.abs(value) < 1){
            return (value * 1e3).toFixed(2) + "m";
        } else if(Math.abs(value) < 1e3){
            return value.toFixed(2);
        } else if(Math.abs(value) < 1e6){
            return (value /1e3).toFixed(2) + "k";
        } else if(Math.abs(value) < 1e9){
            return (value / 1e6).toFixed(2) + "meg";
        } else {
            return (value  /1e9).toFixed(2) + "g";
        }
    }

    let handle_parameter_change = (event: React.KeyboardEvent<HTMLInputElement>) =>{
        if(event.key==="Enter"|| event.key ==="Tab") {
            let field = event.currentTarget.name;
            let value = event.currentTarget.value;
            let multiplier = 1;
            if(value.endsWith("p") || value.endsWith("P")){
                multiplier = 1e-12;
            } else if(value.endsWith("n") || value.endsWith("N")){
                multiplier = 1e-9;
            } else if(value.endsWith("u") || value.endsWith("U") || value.endsWith("µ") ){
                multiplier = 1e-6;
            } else if(value.endsWith("m") || value.endsWith("M")){
                multiplier = 1e-3;
            } else if(value.endsWith("k") || value.endsWith("K")){
                multiplier = 1e3;
            } else if(value.endsWith("meg") || value.endsWith("MEG")){
                multiplier = 1e6;
            } else if(value.endsWith("g") || value.endsWith("G")){
                multiplier = 1e9;
            }

            value = value.replace(/[a-zA-Z]+$/g, '');

            let numeric_value = parseFloat(value)*multiplier;
            props.onChange(field, numeric_value);
        }
    }


    let render_square_properties = ()=>{
        return <div>
            <InputField
                key={"square_voff"}
                id="voff"
                name="voff"
                label="V off"
                defaultValue={format_value(props.input.voff[props.channel])}
                onKeyDown={handle_parameter_change}
            />
            <InputField
                key={"square_von"}
                id="von"
                name="von"
                label="V on"
                defaultValue={format_value(props.input.von[props.channel])}
                onKeyDown={handle_parameter_change}
            />
            <InputField
                key={"square_tdelay"}
                id="tdelay"
                name="tdelay"
                label="Delay Time"
                defaultValue={format_value(props.input.tdelay[props.channel])}
                onKeyDown={handle_parameter_change}
            />
            <InputField
                key={"square_ton"}
                id="ton"
                name="ton"
                label="On Time"
                defaultValue={format_value(props.input.ton[props.channel])}
                onKeyDown={handle_parameter_change}
            />
            <InputField
                key={"square_period"}
                id="period"
                name="period"
                label="Period"
                defaultValue={format_value(props.input.period[props.channel])}
                onKeyDown={handle_parameter_change}
            />
        </div>
    }

    let render_triangle_properties = ()=>{
        let duty = props.input.duty[props.channel];
        return <div>
            <InputField
                key={"dc_offset"}
                id="dc_offset"
                name="dc_offset"
                label="DC offset"
                defaultValue={format_value(props.input.dc_offset[props.channel])}
                onKeyDown={handle_parameter_change}
            />
            <InputField
                key={"amplitude"}
                id="amplitude"
                name="amplitude"
                label="Amplitude"
                defaultValue={format_value(props.input.amplitude[props.channel])}
                onKeyDown={handle_parameter_change}
            />
            <InputField
                key={"frequency"}
                id="frequency"
                name="frequency"
                label="Frequency"
                defaultValue={format_value(props.input.frequency[props.channel])}
                onKeyDown={handle_parameter_change}
            />
            <InputField
                key={"phase"}
                id="phase"
                name="phase"
                label="phase"
                defaultValue={format_value(props.input.phase[props.channel])}
                onKeyDown={handle_parameter_change}
            />
            <InputField
                key={"duty"}
                id="duty"
                name="duty"
                label="Duty Cycle"
                defaultValue={duty?duty.toFixed(2):""}
                onKeyDown={handle_parameter_change}
            />
        </div>
    }

    let render_sine_properties = ()=>{
        return  <div>
            <InputField
                key={"dc_offset"}
                id="dc_offset"
                name="dc_offset"
                label="DC offset"
                defaultValue={format_value(props.input.dc_offset[props.channel])}
                onKeyDown={handle_parameter_change}
            />
            <InputField
                key={"amplitude"}
                id="amplitude"
                name="amplitude"
                label="Amplitude"
                defaultValue={format_value(props.input.amplitude[props.channel])}
                onKeyDown={handle_parameter_change}
            />
            <InputField
                key={"frequency"}
                id="frequency"
                name="frequency"
                label="Frequency"
                defaultValue={format_value(props.input.frequency[props.channel])}
                onKeyDown={handle_parameter_change}
            />
            <InputField
                key={"phase"}
                id="phase"
                name="phase"
                label="phase"
                defaultValue={format_value(props.input.phase[props.channel])}
                onKeyDown={handle_parameter_change}
            />
        </div>
    }

    let render_properties = ()=>{
        switch(props.input.shape){
            case "square":
                return render_square_properties();
                case "triangle":
                return render_triangle_properties();
                case "sine":
                return render_sine_properties();
        }
    }

    return(
        <div>
            <SelectField<SimpleStringOption>
                key="waveform_shape"
                label="Waveform Shape"
                onChange={handle_select}
                value={{value: props.input.shape, label: props.input.shape}}
                name="shape"
                options={[
                    {label: "Square", value: "square"},
                    {label: "Triangle", value: "triangle"},
                    {label: "Sine", value: "sine"}
                ]}
            />
            {render_properties()}
        </div>
    );
};
