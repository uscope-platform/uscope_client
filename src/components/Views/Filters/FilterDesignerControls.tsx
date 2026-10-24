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
import {filter_validate} from "#client_core/index.js";
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

    const errors = filter_validate(props.filter_parameters);

    // the fields of each type of filter, in the order the bands follow in the labels
    const FIELDS: Record<string, [string, string][]> = {
        lp: [["n_taps", "Number of taps"], ["pass_band_edge_1", "Pass band edge frequency"], ["stop_band_edge_1", "Stop band edge frequency"]],
        hp: [["n_taps", "Number of taps"], ["pass_band_edge_1", "Pass band edge frequency"], ["stop_band_edge_1", "Stop band edge frequency"]],
        bp: [["n_taps", "Number of taps"], ["stop_band_edge_1", "First stop band edge frequency"], ["pass_band_edge_1", "Pass band first edge frequency"], ["pass_band_edge_2", "Pass band second edge frequency"], ["stop_band_edge_2", "Second stop band edge  frequency"]],
        bs: [["n_taps", "Number of taps"], ["pass_band_edge_1", "First pass band edge frequency"], ["stop_band_edge_1", "Stop band first edge frequency"], ["stop_band_edge_2", "Stop band second edge frequency"], ["pass_band_edge_2", "Second pass band edge  frequency"]],
    };

    let render_filter_parameters = () =>{
        const fields = FIELDS[props.filter_parameters.type];
        if(fields === undefined) return;
        return(
            <div>
                {fields.map(([name, label]) => (
                    <InputField key={name} inline name={name} defaultValue={props.filter_parameters[name]} onKeyDown={handle_edit_field} label={label} error={errors[name]}/>
                ))}
            </div>
        );
    }

    let render_controls = () => {
        return (
            <div key={props.name + "_filter_design_div"}>
                <InputField inline name="sampling_frequency" defaultValue={props.filter_parameters.sampling_frequency} onKeyDown={handle_edit_field} label="Sampling Frequency" error={errors.sampling_frequency}/>
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
