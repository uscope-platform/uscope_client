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


import {SidebarColumn} from "#UI/index.js";
import EmulatorList from "../EmulatorList.jsx";

interface HilSpecsSidebarProps {
    handle_select_emulator: (emulator: number) => void
}

let  HilSpecsSidebar = (props: HilSpecsSidebarProps) =>{


    return(
        <SidebarColumn
            style={{paddingTop: "10px", paddingBottom: "10px", paddingRight: "10px"}}
            panels={[{title: "Emulator List", content: (
                <EmulatorList on_select={props.handle_select_emulator}/>
            )}]}
        />
    );

};

export default HilSpecsSidebar;
