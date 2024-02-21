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

import React, {useState} from 'react';

import {Responsive, WidthProvider} from "react-grid-layout";
import FcoreEmulationEditor from "./FcoreEmulationEditor";
import {TabbedContent, UIPanel} from "../UI_elements"
import EmulationResults from "./EmulationResults";
import HilPlotTab from "./HilControl/HilPlotTab";
import {useDispatch, useSelector} from "react-redux";
import {setSetting} from "../../redux/Actions/SettingsActions";


const ResponsiveGridLayout = WidthProvider(Responsive);

let HilView = function (props) {

    const settings = useSelector(state => state.settings);
    const dispatch = useDispatch();

    let [emulation_results, set_emulation_results] = useState({});
    let [input_data, set_input_data] = useState({});
    let [deployed, set_deployed] = useState(false);

    let on_select = (value) =>{
        dispatch(setSetting(["emulator_selected_tab", value]))
    }

    return(
        <ResponsiveGridLayout
            className="layout"
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
            cols={{ lg: 24, md: 20, sm: 12, xs: 8, xxs: 4 }}
            rowHeight={30}
            useCSSTransforms={false}
        >
            <UIPanel key="emulator_diagram" data-grid={{x: 0, y: 0, w: 24, h: 25, static: true}} level="level_2">
                <TabbedContent height="100%" names={["Emulation setup", "Emulation Results", "Hil Scope"]} contents={[
                    <FcoreEmulationEditor onEmulationDone={set_emulation_results} onInputDataChange={set_input_data} onDeploy={()=>{set_deployed(true)}}/>,
                    <EmulationResults results={emulation_results} inputs={input_data}/>,
                    <HilPlotTab deployed={deployed}/>
                ]} onSelect={on_select} selected={settings.emulator_selected_tab}/>
            </UIPanel>
        </ResponsiveGridLayout>

    );
};

export default HilView;
