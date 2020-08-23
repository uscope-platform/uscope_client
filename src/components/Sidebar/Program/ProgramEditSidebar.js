import React from "react";
import {
    FormLayout,
    SidebarBlockLayout,
    SidebarBlockTitleLayout
} from "../../UI_elements";
import {useSelector} from "react-redux";
import{ProgramProperties} from "../../UI_elements/SidebarComponents/ProgramProperties";


let ProgramEditSidebar = props =>{
    const settings = useSelector(state => state.settings);
    const programs = useSelector(state => state.programs);

    return(
        <SidebarBlockLayout padding={'1rem'}>
            <SidebarBlockTitleLayout>
                <label style={{fontSize:'20px',fontWeight:600}}>{"Program"}</label>
            </SidebarBlockTitleLayout>
            <FormLayout>
                <ProgramProperties server={settings.server} program={props.selected_program} field_name='name' field_value={programs[props.selected_program].name}/>
                <ProgramProperties server={settings.server} program={props.selected_program} field_name='path' field_value={programs[props.selected_program].path}/>
                <ProgramProperties server={settings.server} program={props.selected_program} field_name='program type' field_value={programs[props.selected_program].program_type}/>
            </FormLayout>
        </SidebarBlockLayout>
    )
};

export default ProgramEditSidebar;