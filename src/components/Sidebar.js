import React, {Component}  from 'react';

import {connect} from "react-redux"
import SidebarLayout from "./UI_elements/SidebarLayout";
import BlockTitle from "./UI_elements/BlockTitle";


function mapStateToProps(state) {
    return{
        modals:state.modals,
        settings:state.settings,
        applications:state.applications
    }
}


class Sidebar extends Component {

    render(){
        if(!this.props.settings.current_view_requires_sidebar)
            return null;

        return(
            <SidebarLayout>
                <BlockTitle>Properties Area</BlockTitle>
            </SidebarLayout>
        );
    };
}

export default connect(mapStateToProps)(Sidebar);
