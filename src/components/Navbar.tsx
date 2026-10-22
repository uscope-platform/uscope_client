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
import {ColorTheme, Image} from "#UI/index.js";
import {NavLink} from "react-router-dom";
import  {styled} from "goober";
import {themePreference, setTheme, type ThemePreference} from "#UI/themes.js";
import {MdLightMode, MdDarkMode, MdSettingsBrightness} from "react-icons/md";


const ComponentLayout = styled('div')`
    display: flex;   
    flex-direction: column;
    
`

const ThemeToggle = styled('button')`
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 1rem auto 0;
    padding: 0.35rem;
    cursor: pointer;
    color: ${ColorTheme.text};
    background: transparent;
    border: 1px solid ${ColorTheme.background.borders};
    border-radius: 50%;
    &:hover {
        background: ${ColorTheme.background.level_4};
    }
`

const next_theme: Record<ThemePreference, ThemePreference> = {system: "light", light: "dark", dark: "system"};

const theme_icons: Record<ThemePreference, React.ReactNode> = {
    system: <MdSettingsBrightness size="1.5em"/>,
    light: <MdLightMode size="1.5em"/>,
    dark: <MdDarkMode size="1.5em"/>,
};

interface NavbarProps {
    views: any;
}

let  Navbar = (props: NavbarProps) =>{

    let link_stile = ({isActive}: any) =>{
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
                color: ColorTheme.text,
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
            <ThemeToggle
                onClick={() => setTheme(next_theme[themePreference])}
                title={"Theme: " + themePreference + " (click for " + next_theme[themePreference] + ")"}
                aria-label="Change theme">
                {theme_icons[themePreference]}
            </ThemeToggle>
        </ComponentLayout>

    );
};

export default Navbar;
