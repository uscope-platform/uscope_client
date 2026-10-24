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

import {styled} from "goober";
import {ColorTheme, InputField} from "#UI/index.js";
import LowPass from "./filterIcons/LowPass.js"
import HighPass from "./filterIcons/HighPass.js"
import BandPass from "./filterIcons/BandPass.js"
import BandStop from "./filterIcons/BandStop.js"

// the types of filter side by side, each a tile with the shape of its response
const TypeSelector = styled('div')`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(6.5rem, 1fr));
  gap: 0.4rem;
  margin: 0.5em;
`

const TypeTile = styled('button')`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5em;
  padding: 0.4em 0.7em;
  border-radius: 5px;
  border: 2px solid ${ColorTheme.background.borders};
  background: ${ColorTheme.background.level_3};
  color: ${ColorTheme.text};
  font: inherit;
  font-size: 0.85rem;
  cursor: pointer;
  transition: border-color 0.2s;
  &:hover {
    border-color: ${ColorTheme.background.accents};
  }
  &[aria-pressed="true"] {
    border-color: ${ColorTheme.background.accents};
    background: ${ColorTheme.background.transparent_accents};
  }
`

interface FilterDesignerControls{
    name: string,
    on_change: (key: string, value: any) => void,
    filter_parameters: Record<string, any>
}

let  FilterDesignerControls = (props: FilterDesignerControls) =>{

    let handleFilterChange = (type: string) => {
        props.on_change("type", type);
    };

    let handle_edit_field = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if(event.key==="Enter"|| event.key ==="Tab"){
            props.on_change(event.currentTarget.name, parseFloat(event.currentTarget.value));
        }
    }

    let render_filter_parameters = () =>{
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

        return;
    }

    let render_controls = () => {
        return (
            <div key={props.name + "_filter_design_div"}>
                <InputField inline name="sampling_frequency" defaultValue={props.filter_parameters.sampling_frequency} onKeyDown={handle_edit_field} label="Sampling Frequency"/>
                <TypeSelector role="group" aria-label="Filter type">
                    {[
                        {type: "lp", label: "Low pass", Icon: LowPass},
                        {type: "hp", label: "High pass", Icon: HighPass},
                        {type: "bp", label: "Band pass", Icon: BandPass},
                        {type: "bs", label: "Band stop", Icon: BandStop},
                    ].map(({type, label, Icon}) => (
                        <TypeTile key={type} aria-pressed={props.filter_parameters.type === type} onClick={() => handleFilterChange(type)}>
                            <Icon onClick={() => {}} active={props.filter_parameters.type === type}/>
                            {label}
                        </TypeTile>
                    ))}
                </TypeSelector>
                {render_filter_parameters()}
            </div>

        )
    }

    return render_controls();
};

export default FilterDesignerControls;
