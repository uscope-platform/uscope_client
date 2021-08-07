import React from "react";
import {
    FormLayout,
    SidebarBlockLayout,
    SidebarBlockTitleLayout
} from "../../UI_elements";
import {useSelector} from "react-redux";
import {BitstreamProperties} from "../../UI_elements/SidebarComponents/BitstreamProperties";



let BitstreamEditSidebar = props =>{
    const settings = useSelector(state => state.settings);
    const bitstreams = useSelector(state => state.bitstreams);

    return(
        <SidebarBlockLayout padding={'1rem'}>
            <SidebarBlockTitleLayout>
                <label style={{fontSize:'20px',fontWeight:600}}>{"Bitstreams"}</label>
            </SidebarBlockTitleLayout>
            <FormLayout>
                <BitstreamProperties server={settings.server}  bitstream={props.selected_bitstream} field_name='name' field_value={bitstreams[props.selected_bitstream].name}/>

            </FormLayout>
        </SidebarBlockLayout>
    )
};

export default BitstreamEditSidebar;