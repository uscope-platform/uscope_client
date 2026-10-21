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

import React, {useEffect} from "react";
import {init_terminal, dispose_terminal} from "#client_core/index.js";
import {terminal_options} from "#client_core/terminal/terminal_theme.js";
import 'xterm/css/xterm.css';
import './terminal.css';

interface TerminalProps {

}

let TerminalComponent = (props: TerminalProps) =>{

    useEffect(()=>{
        if(init_terminal() === undefined) return;
        // each mount makes its own terminal, the one of a previous mount must not linger
        return dispose_terminal;
    },[])

    // fills the container of the panel (the terminal follows its size), a fixed height made it scroll in the panel
    // the padding is outside of the terminal, which is fitted in what is left
    return(
        <div id="xterm" style={{
            height: "100%",
            width: "100%",
            boxSizing: "border-box",
            padding: "6px 8px",
            background: terminal_options.theme?.background
        }} />
    )
};

export default TerminalComponent;