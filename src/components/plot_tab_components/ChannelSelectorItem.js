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

import {Checkbox} from "../UI_elements";
import styled from "styled-components";

const Centering = styled.div`
  margin: 0 auto;  
`

let  ChannelSelectorItem = props => {

    function handleChannelStateChange(event){
        let channel_status = {id:event.target.name, status:event.target.checked}
        props.onStatusChange(channel_status);
    }

    return(
        <Centering>
            <Checkbox style={{marginRight:'0.5rem'}} name={props.id} onChange={handleChannelStateChange} value={props.value} label={props.name}/>
        </Centering>
    );
}


export default ChannelSelectorItem;
