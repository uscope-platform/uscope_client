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
