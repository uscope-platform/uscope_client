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

import React, {useEffect, useRef} from "react";
import {init_terminal} from "@client_core";
import 'xterm/css/xterm.css';

let TerminalComponent = props =>{

    const term = useRef(null);
    const hasInitialized = useRef(false);

    useEffect(()=>{
        if(!hasInitialized.current){
            term.current = init_terminal();
            hasInitialized.current = true;
        }

    },[])

    return(
        <div id="xterm" style={{ height: "15em", width: "100%" }} />
    )
};

export default TerminalComponent;