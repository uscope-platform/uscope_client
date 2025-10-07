// Copyright 2025 Filippo Savi
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
import EmulationResults from "./EmulationResults.jsx";
import HilResultsSidebar from "../Sidebar/per_panel_sidebars/HilResultsSidebar.jsx";
import {download_json} from "@client_core";

let HilResultsView = function (props) {

    let handle_download = () =>{
        download_json(props.emulation_results, props.filename + "_results");
    }

    return(
        <div style={{
            display:"flex",
            flexDirection:"row",
            gap:10,
            height:"100%"
        }}>

            <EmulationResults
                results={props.emulation_results}
                inputs={props.input_data}
            />
            <HilResultsSidebar on_download={handle_download}/>
        </div>

    );
};

export default HilResultsView;
