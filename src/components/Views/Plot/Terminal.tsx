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
import {init_terminal} from "#client_core/index.js";
import 'xterm/css/xterm.css';

interface TerminalProps {

}

let TerminalComponent = (props: TerminalProps) =>{

    const term = useRef<ReturnType<typeof init_terminal> | null>(null);
    const hasInitialized = useRef(false);

    useEffect(()=>{
        if(!hasInitialized.current){
            let terminal = init_terminal();
            if(terminal === undefined) return;
            term.current = terminal;
            hasInitialized.current = true;
        }

    },[])

    return(
        <div id="xterm" style={{ height: "15em", width: "100%" }} />
    )
};

export default TerminalComponent;