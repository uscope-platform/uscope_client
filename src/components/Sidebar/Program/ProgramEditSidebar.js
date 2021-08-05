import React from "react";
import {
    FormLayout,
    SidebarBlockLayout,
    SidebarBlockTitleLayout
} from "../../UI_elements";
import {useSelector} from "react-redux";
import{ProgramProperties} from "../../UI_elements/SidebarComponents/ProgramProperties";
import {SelectField} from "../../UI_elements/Select";



let ProgramEditSidebar = props =>{
    const settings = useSelector(state => state.settings);
    const programs = useSelector(state => state.programs);

    let handleTypeChange = (event) =>{
        let edit = {program:props.selected_program, field:event.target.name, value:event.target.value}
        settings.server.prog_proxy.edit_program(edit);
        debugger;
    }

    let allowed_types = ["asm", "C"];
    return(
        <SidebarBlockLayout padding={'1rem'}>
            <SidebarBlockTitleLayout>
                <label style={{fontSize:'20px',fontWeight:600}}>{"Program"}</label>
            </SidebarBlockTitleLayout>
            <FormLayout>
                <ProgramProperties server={settings.server} program={props.selected_program} field_name='name' field_value={programs[props.selected_program].name}/>
                <SelectField label="Program type" onChange={handleTypeChange} defaultValue={programs[props.selected_program].program_type}
                             name="program_type" placeholder="Program type" options={allowed_types}/>
            </FormLayout>
        </SidebarBlockLayout>
    )
};

export default ProgramEditSidebar;