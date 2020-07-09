import React, {Component}  from 'react';

import {connect} from "react-redux"
import SidebarLayout from "../UI_elements/Layouts/SidebarLayout";
import PeripheralsSidebar from "./PeripheralsSidebar";


function mapStateToProps(state) {
    return{
        modals:state.modals,
        settings:state.settings,
        peripherals:state.peripherals,
    }
}


class Sidebar extends Component {

    render(){
        if(!this.props.settings.current_view_requires_sidebar)
            return null;

        return(
            <SidebarLayout>
                <PeripheralsSidebar server = {this.props.server}/>
            </SidebarLayout>
        );
    };
}

export default connect(mapStateToProps)(Sidebar);
