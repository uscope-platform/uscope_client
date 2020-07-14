import React, {useState} from 'react';


import {useSelector} from "react-redux";
import PeripheralEditSidebar from "./PeripheralEditSidebar";

import InputField from "../../UI_elements/InputField";
import SidebarContentLayout from "../../UI_elements/Layouts/SidebarContentLayout";
import BlockTitle from "../../UI_elements/BlockTitle";
import PeripheralImage from "./PeripheralImage";
import {create_peripheral} from "../../../utilities/PeripheralUtilities";

let  PeripheralsSidebar = props =>{
    const settings = useSelector(state => state.settings);
    const [image, set_image] = useState(null);

    let handle_add_peripheral = (event) =>{
        if (event.key === "Enter") {

            let peripheral = create_peripheral(event.target.value)
            settings.server.creator_proxy.createPeripheral(peripheral, image);
        }
    };

    let handleImageChoiceDone = (image) =>{
        set_image(image);
    };

    if(!settings.current_peripheral)
        return (
            <SidebarContentLayout peripheral>
                <BlockTitle>Peripheral actions</BlockTitle>
                <PeripheralImage done={handleImageChoiceDone}/>
                <InputField compact label="Add a peripheral" onKeyDown={handle_add_peripheral}/>

            </SidebarContentLayout>
        );

    return(
        <PeripheralEditSidebar/>
    );
};

export default PeripheralsSidebar;
