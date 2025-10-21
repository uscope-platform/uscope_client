// Copyright 2021 University of Nottingham Ningbo China
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

import {Checkbox, ColorTheme} from "#UI/index.js";
import {styled} from "goober";
import {MdRemove} from "react-icons/md";

const Centering = styled('div')`
  margin: 0 auto;  
  display: flex;
  flex-direction: row;
  width: fit-content;
`

interface ChannelSelectorItemProps {
    idx:number,
    id: string,
    name: string,
    value: boolean,
    onStatusChange: (channel_status: {id: string, status: boolean}) => void;
}

let  ChannelSelectorItem = (props: ChannelSelectorItemProps) => {

    function handleChannelStateChange(event: React.ChangeEvent<HTMLInputElement>){
        let channel_status = {id:event.target.name, status:event.target.checked}
        props.onStatusChange(channel_status);
    }
    const selected_color = ColorTheme.plot_palette[props.idx];
    const channel_color: string = selected_color !== undefined ? selected_color : "rgb(255,0,0)";
    return(
        <Centering>
            <MdRemove style={{marginTop:"3px"}} color={channel_color}/>
            <Checkbox style={{marginRight:'0.5rem'}} name={props.id} onChange={handleChannelStateChange} value={props.value} label={props.name}/>
        </Centering>
    );
}


export default ChannelSelectorItem;
