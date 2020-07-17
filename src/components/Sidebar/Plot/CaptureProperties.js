import React, {useState} from "react";
import {
    Button, FormLayout,
    InputField,
    SidebarBlockLayout,
    SidebarBlockTitleLayout
} from "../../UI_elements";

let CaptureProperties = props =>{

    const [n_buffers, set_n_buffers] = useState("");

    let handle_change = (event) =>{
        set_n_buffers(event.target.value);
    };

    let handle_close = (event) =>{
        props.done(n_buffers);
    };



    return(
        <SidebarBlockLayout padding={'1rem'}>
            <SidebarBlockTitleLayout>
                <label style={{fontSize:'20px',fontWeight:600}}>{"Capture Settings"}</label>
            </SidebarBlockTitleLayout>
            <FormLayout>
                <InputField inline name='n_buffers' onChange={handle_change} label="Number of buffers"/>
                <Button onClick={handle_close}>Submit changes</Button>
            </FormLayout>
        </SidebarBlockLayout>
    )
};

export default CaptureProperties;