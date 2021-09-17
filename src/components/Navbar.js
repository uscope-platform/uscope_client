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

    let link_default_style = {
        display:"block",
        backgroundColor: ColorTheme.dark_theme.level_1,
        color: "white",
        textDecoration: "none",
        marginTop: "0.5rem",
        borderRadius: "0.5rem",
        paddingLeft: "0.5rem",
    }

    let link_active_style = {
        backgroundColor: ColorTheme.dark_theme.level_3
    }
    return(
        <ComponentLayout>
            <Image src="assets/logo.svg" alt='µScope Logo'/>
            <Image src="assets/name.svg" alt='µScope Name'/>
            {props.views.map((tab, i) => {
                if(tab.user_accessible){
                    return(
                        <NavLink style={link_default_style} activeStyle={link_active_style} key={tab.peripheral_id} to={'/'+tab.peripheral_id} className="nav-link">
                            {tab.name}
                        </NavLink>
                    )
                } else {
                    return null;
                }
            })}
        </ComponentLayout>

    );
};

export default Navbar;
