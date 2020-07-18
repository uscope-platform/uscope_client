import React from 'react';

import ScriptEditSidebar from "./ScriptEditSidebar";
import {useSelector} from "react-redux";
import {BlockTitle, InputField, SidebarContentLayout} from "../../UI_elements";



let  ScriptSidebar = props =>{

    const settings = useSelector(state => state.settings);

    if(!settings.selected_script)
        return (
            <SidebarContentLayout peripheral>
                <BlockTitle>Scripts actions</BlockTitle>
                <InputField compact label="Add a script"/>

            </SidebarContentLayout>
        );

    return(
        <ScriptEditSidebar selected_script={settings.selected_script}/>
    );
};

export default ScriptSidebar;
