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
import {ColorTheme, Image} from "./UI_elements";
import {NavLink} from "react-router-dom";
import styled from "styled-components";


const ComponentLayout = styled.div`
    display: flex;   
    flex-direction: column;
    
`

let  Navbar = props =>{

    let link_stile = ({isActive}) =>{
        if(isActive){
            return  {
                display:"block",
                backgroundColor: ColorTheme.dark_theme.level_3,
                color: "white",
                textDecoration: "none",
                marginTop: "0.5rem",
                borderRadius: "0.5rem",
                paddingLeft: "0.5rem",
            }

        } else {
            return  {
                display:"block",
                backgroundColor: ColorTheme.dark_theme.level_1,
                color: "white",
                textDecoration: "none",
                marginTop: "0.5rem",
                borderRadius: "0.5rem",
                paddingLeft: "0.5rem",
            }
        }
    }
    return(
        <ComponentLayout>
            <Image src="assets/logo.svg" alt='µScope Logo'/>
            <Image src="assets/name.svg" alt='µScope Name'/>
            <NavLink style={link_stile} key="plot" to='/' className="nav-link">MAIN</NavLink>
            <NavLink style={link_stile} key="script_manager" to='/script_manager' className="nav-link">SCRIPTS</NavLink>
            <NavLink style={link_stile} key="applications_manager" to='/applications_manager' className="nav-link">APPLICATIONS</NavLink>
            <NavLink style={link_stile} key="program_manager" to='/program_manager' className="nav-link">PROGRAMS</NavLink>
            <NavLink style={link_stile} key="bitstream_manager" to='/bitstream_manager' className="nav-link">BITSTREAMS</NavLink>
            <NavLink style={link_stile} key="peripherals_manager" to='/peripherals_manager' className="nav-link">PERIPHERALS</NavLink>
            <NavLink style={link_stile} key="platform_manager" to='/platform_manager' className="nav-link">PLATFORM</NavLink>
        </ComponentLayout>

    );
};

export default Navbar;
