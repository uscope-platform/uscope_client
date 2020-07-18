import React from "react";
import {
    FormLayout,
    SidebarBlockLayout,
    SidebarBlockTitleLayout
} from "../../UI_elements";
import {useSelector} from "react-redux";
import {ScriptProperties} from "../../UI_elements/SidebarComponents/ScriptProperties";


let ScriptEditSidebar = props =>{
    const settings = useSelector(state => state.settings);
    const scripts = useSelector(state => state.scripts);

    return(
        <SidebarBlockLayout padding={'1rem'}>
            <SidebarBlockTitleLayout>
                <label style={{fontSize:'20px',fontWeight:600}}>{"Script Peripherals"}</label>
            </SidebarBlockTitleLayout>
            <FormLayout>
                <ScriptProperties server={settings.server} script={props.selected_script} field_name='name' field_value={scripts[props.selected_script].name}/>
                <ScriptProperties server={settings.server} script={props.selected_script} field_name='path' field_value={scripts[props.selected_script].path}/>
                <ScriptProperties server={settings.server} script={props.selected_script} field_name='triggers' field_value={scripts[props.selected_script].triggers}/>
            </FormLayout>
        </SidebarBlockLayout>
    )
};

export default ScriptEditSidebar;