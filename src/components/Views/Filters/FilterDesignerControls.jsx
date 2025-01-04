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

import styled from "styled-components";
import {InputField} from "@UI";
import LowPass from "./filterIcons/LowPass"
import HighPass from "./filterIcons/HighPass"
import BandPass from "./filterIcons/BandPass"
import BandStop from "./filterIcons/BandStop"

const ComponentStyle = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: row;
`

let  FilterDesignerControls = props =>{

    let handleFilterChange = (event) => {
        let type = event.target.id;
        props.on_change("type", type);
    };

    let handle_edit_field = (event) => {
        if(event.key==="Enter"|| event.key ==="Tab"){
            props.on_change(event.target.name, parseFloat(event.target.value));
        }
    }

    let handle_rename = (event) => {
        if(event.key==="Enter"|| event.key ==="Tab"){
            props.on_rename(event.target.name, event.target.value);
        }
    }

    let render_filter_parameters = () =>{
        let ret = [];
        ret.push();
        if(["lp", "hp"].includes(props.filter_parameters.type)){
            return(
                <div>
                    <InputField  inline name="n_taps" defaultValue={props.filter_parameters.n_taps} onKeyDown={handle_edit_field} label="Number of taps"/>
                    <InputField inline name="pass_band_edge_1" defaultValue={props.filter_parameters.pass_band_edge_1} onKeyDown={handle_edit_field} label="Pass band edge frequency"/>
                    <InputField inline name="stop_band_edge_1" defaultValue={props.filter_parameters.stop_band_edge_1} onKeyDown={handle_edit_field} label="Stop band edge frequency"/>
                </div>
            );

        } else if(props.filter_parameters.type==="bp") {
            return (
                <div>
                    <InputField inline name="n_taps" defaultValue={props.filter_parameters.n_taps}
                                onKeyDown={handle_edit_field} label="Number of taps"/>
                    <InputField inline name="stop_band_edge_1" defaultValue={props.filter_parameters.stop_band_edge_1}
                                onKeyDown={handle_edit_field} label="First stop band edge frequency"/>
                    <InputField inline name="pass_band_edge_1" defaultValue={props.filter_parameters.pass_band_edge_1}
                                onKeyDown={handle_edit_field} label="Pass band first edge frequency"/>
                    <InputField inline name="pass_band_edge_2" defaultValue={props.filter_parameters.pass_band_edge_2}
                                onKeyDown={handle_edit_field} label="Pass band second edge frequency"/>
                    <InputField inline name="stop_band_edge_2" defaultValue={props.filter_parameters.stop_band_edge_2}
                                onKeyDown={handle_edit_field} label="Second stop band edge  frequency"/>
                </div>
            );
        } else if (props.filter_parameters.type === "bs") {
            return (
                <div>
                    <InputField inline name="n_taps" defaultValue={props.filter_parameters.n_taps}
                                onKeyDown={handle_edit_field} label="Number of taps"/>
                    <InputField inline name="pass_band_edge_1" defaultValue={props.filter_parameters.pass_band_edge_1}
                                onKeyDown={handle_edit_field} label="First pass band edge frequency"/>
                    <InputField inline name="stop_band_edge_1" defaultValue={props.filter_parameters.stop_band_edge_1}
                                onKeyDown={handle_edit_field} label="Stop band first edge frequency"/>
                    <InputField inline name="stop_band_edge_2" defaultValue={props.filter_parameters.stop_band_edge_2}
                                onKeyDown={handle_edit_field} label="Stop band second edge frequency"/>
                    <InputField inline name="pass_band_edge_2" defaultValue={props.filter_parameters.pass_band_edge_2}
                                onKeyDown={handle_edit_field} label="Second pass band edge  frequency"/>
                </div>
            );
        }

        return ret;
    }

    let render_controls = () => {
        return (
            <div key={props.name + "_filter_design_div"}>
                <InputField inline name="name" defaultValue={props.name} onKeyDown={handle_rename} label="Filter Name"/>
                <InputField inline name="sampling_frequency" defaultValue={props.filter_parameters.sampling_frequency} onKeyDown={handle_edit_field} label="Sampling Frequency"/>
                <ComponentStyle>
                    <LowPass  onClick={handleFilterChange} active={props.filter_parameters.type==="lp"} />
                    <HighPass onClick={handleFilterChange} active={props.filter_parameters.type==="hp"} />
                    <BandPass onClick={handleFilterChange} active={props.filter_parameters.type==="bp"} />
                    <BandStop onClick={handleFilterChange} active={props.filter_parameters.type==="bs"} />
                </ComponentStyle>
                {render_filter_parameters()}
            </div>

        )
    }

    return render_controls();
};

export default FilterDesignerControls;
