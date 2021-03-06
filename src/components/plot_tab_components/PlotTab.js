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
import {useSelector} from "react-redux";


import ChannelSelector from "./ChannelSelector";
import PlotComponent from "./PlotComponent";
import ParametersArea from "./ParametersArea";
import MacroActions from "./MacroActions";
import styled from "styled-components";
import {ColorTheme} from "../UI_elements";


const ComponentLayout = styled.div`
  display: grid;
  grid-template-columns: auto auto;
  grid-auto-rows: auto;
  align-items: center;
  grid-gap: 1.5em;
`

let PlotTab = function (props) {
    const channels = useSelector(state => state.channels);
    const settings = useSelector(state => state.settings);

        return(
            <ComponentLayout>
                <ChannelSelector channels={channels}/>
                <PlotComponent palette={{colorway:ColorTheme.plot_palette}} refreshRate={settings.refreshRate}/>
                <ParametersArea />
                <MacroActions />
            </ComponentLayout>
        );
};

export default PlotTab;
