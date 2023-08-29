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
                backgroundColor: ColorTheme.background.accents,
                color: "white",
                textDecoration: "none",
                marginTop: "0.5rem",
                borderRadius: "0.5rem",
                paddingLeft: "0.5rem",
            }

        } else {
            return  {
                display:"block",
                backgroundColor: ColorTheme.background.level_2,
                color: "white",
                textDecoration: "none",
                marginTop: "0.5rem",
                borderRadius: "0.5rem",
                paddingLeft: "0.5rem",
            }
        }
    }

    let render_navbar = () =>{
        let ret = []

        for(const v in props.views){
            let route = "/";
            if(v!=='scope'){
                route += props.views[v].type;
            }
            ret.push(<NavLink style={link_stile} key={props.views[v].name} to={route} className="nav-link">{props.views[v].name}</NavLink>);
        }

        return ret;
    };

    return(
        <ComponentLayout>
            <Image src="assets/logo.svg" alt='µScope Logo'/>
            <Image src="assets/name.svg" alt='µScope Name'/>
            {render_navbar()}
        </ComponentLayout>

    );
};

export default Navbar;
