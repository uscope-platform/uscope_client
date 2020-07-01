import React from 'react';

import {Nav} from 'react-bootstrap'
import {Link} from "react-router-dom";

let  Navbar = props =>{

    return(

        <Nav id="navbar-element" variant="tabs" >
            {props.tabs.map((tab, i) => {
                if(tab.user_accessible){
                    return(
                        <Nav.Item key={tab.name+"_item"}>
                            <Link key={tab.name} to={'/'+tab.name} className="nav-link">{tab.name}</Link>
                        </Nav.Item>
                    )
                } else {
                    return null;
                }
            })}
        </Nav>

    );
};

export default Navbar;
