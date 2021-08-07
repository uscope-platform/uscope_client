import React from 'react';

import BitstreamEditSidebar from "./BitstreamEditSidebar";
import {useSelector} from "react-redux";
import {BlockTitle, SidebarContentLayout} from "../../UI_elements";



let  BitstreamSidebar = props =>{

    const settings = useSelector(state => state.settings);

    if(!settings.selected_bitstream)
        return (
            <SidebarContentLayout peripheral>
                <BlockTitle>Bitstream actions</BlockTitle>
            </SidebarContentLayout>
        );

    return(
        <BitstreamEditSidebar selected_bitstream={settings.selected_bitstream}/>
    );
};

export default BitstreamSidebar;
