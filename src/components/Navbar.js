import React from 'react';

import {Nav} from 'react-bootstrap'
import {Link} from "react-router-dom";

let  Navbar = props =>{

    return(

        <Nav variant="tabs" >
            {props.tabs.map((tab, i) => {
                if(tab.user_accessible){
                    return(
                        <Nav.Item>
                            <Link to={'/'+tab.name} className="nav-link">{tab.name}</Link>
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
