import React from 'react';

import ProgramEditSidebar from "./ProgramEditSidebar";
import {useSelector} from "react-redux";
import {BlockTitle, SidebarContentLayout} from "../../UI_elements";



let  ProgramSidebar = props =>{

    const settings = useSelector(state => state.settings);

    if(!settings.selected_program)
        return (
            <SidebarContentLayout peripheral>
                <BlockTitle>Program actions</BlockTitle>
            </SidebarContentLayout>
        );

    return(
        <ProgramEditSidebar selected_program={settings.selected_program}/>
    );
};

export default ProgramSidebar;
