import React from 'react';

import {Link} from "react-router-dom";
import styled from "styled-components";
import Image from "./UI_elements/Image";



const ComponentLayout = styled.div`
    display: flex;
    flex-direction: column;
    
`

const LinkContainer = styled.div`
     display: block;
     background-color: #1d7097;
     margin-top: 0.5rem;
     border-radius: 0.5rem;
`

let  Navbar = props =>{

    return(
        <ComponentLayout>
            <Image src="assets/logo.svg" alt='µScope Logo'/>
            <Image src="assets/name.svg" alt='µScope Name'/>
            {props.tabs.map((tab, i) => {
                if(tab.user_accessible){
                    return(
                        <LinkContainer>
                            <Link key={tab.name} to={'/'+tab.name} className="nav-link">{tab.name}</Link>
                        </LinkContainer>
                    )
                } else {
                    return null;
                }
            })}
        </ComponentLayout>

    );
};

export default Navbar;
