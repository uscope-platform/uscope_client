// Copyright 2021 Filippo Savi
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
import {ColorTheme, InputField} from "../UI_elements";
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
        switch (type){
            case "low_pass":
                props.on_change({type:"select_filter", value: [true, false, false, false]})
                break;
            case "high_pass":
                props.on_change({type:"select_filter", value: [false, true, false, false]})
                break;
            case "band_pass":
                props.on_change({type:"select_filter", value: [false, false, true, false]})
                break;
            case "band_stop":
                props.on_change({type:"select_filter", value: [false, false, false, true]})
                break;
        }
    };

    let handle_edit_field = (event) => {
        if(event.key==="Enter"|| event.key ==="Tab"){
            props.on_change({type:event.target.name, value: event.target.value});
        }
    }

    let render_filter_parameters = () =>{
        let ret = [];
        ret.push(<InputField inline name="pass_band_ripple" defaultValue={props.filter_parameters.pass_band_ripple} onKeyDown={handle_edit_field} label="Pass Band Ripple"/>);
        ret.push(<InputField inline name="stop_band_ripple" defaultValue={props.filter_parameters.stop_band_ripple} onKeyDown={handle_edit_field} label="Stop Band Ripple"/>);
        if(props.filter_type[0] || props.filter_type[1]){
            ret.push(<InputField inline name="cutoff_frequency" defaultValue={props.filter_parameters.cutoff_frequency} onKeyDown={handle_edit_field} label="Cut Frequency"/>);
        } else if(props.filter_type[2]){
            ret.push(<InputField inline name="cut_in_frequency" defaultValue={props.filter_parameters.cut_in_frequency} onKeyDown={handle_edit_field} label="Cut-in Frequency"/>);
            ret.push(<InputField inline name="cut_off_frequency" defaultValue={props.filter_parameters.cut_off_frequency} onKeyDown={handle_edit_field} label="Cut-off Frequency"/>);
        } else{
            ret.push(<InputField inline name="cut_off_frequency" defaultValue={props.filter_parameters.cut_off_frequency} onKeyDown={handle_edit_field} label="Cut-off Frequency"/>);
            ret.push(<InputField inline name="cut_in_frequency" defaultValue={props.filter_parameters.cut_in_frequency} onKeyDown={handle_edit_field} label="Cut-in Frequency"/>);
        }


        return ret;
    }

    let render_controls = () =>{
        return(
            <div>
                <ComponentStyle>
                    <LowPass onClick={handleFilterChange} color={props.filter_type[0]?ColorTheme.icons_color:ColorTheme.inactive_icons_color}/>
                    <HighPass onClick={handleFilterChange} color={props.filter_type[1]?ColorTheme.icons_color:ColorTheme.inactive_icons_color}/>
                    <BandPass onClick={handleFilterChange} color={props.filter_type[2]?ColorTheme.icons_color:ColorTheme.inactive_icons_color}/>
                    <BandStop onClick={handleFilterChange} color={props.filter_type[3]?ColorTheme.icons_color:ColorTheme.inactive_icons_color}/>
                </ComponentStyle>
                {render_filter_parameters()}
            </div>

        )
    }

    return render_controls();
};

export default FilterDesignerControls;
