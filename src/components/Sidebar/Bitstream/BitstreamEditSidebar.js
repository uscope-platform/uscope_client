import React, {useRef} from "react";
import {
    Button,
    FormLayout,
    SidebarBlockLayout,
    SidebarBlockTitleLayout
} from "../../UI_elements";
import {useSelector} from "react-redux";
import {BitstreamProperties} from "../../UI_elements/SidebarComponents/BitstreamProperties";
import {handle_file_chosen} from "../../../utilities/BitstreamUtilities";




let BitstreamEditSidebar = props =>{
    const inputFile = useRef(null)
    const settings = useSelector(state => state.settings);
    const bitstreams = useSelector(state => state.bitstreams);


    let upload_file = (event) => {
        handle_file_chosen( inputFile).then((file_content =>{
            let  edit = {id:props.selected_bitstream, field:{name:"file_content", value:file_content}}
            settings.server.bitstream_proxy.edit_bitstream(edit);
        }));
    }
    let handle_open_file_chooser = (event) =>{
        inputFile.current.click();
    }

    return(
        <SidebarBlockLayout padding={'1rem'}>
            <SidebarBlockTitleLayout>
                <label style={{fontSize:'20px',fontWeight:600}}>{"Bitstreams"}</label>
            </SidebarBlockTitleLayout>
            <FormLayout>
                <BitstreamProperties server={settings.server}  bitstream={props.selected_bitstream} field_name='name' field_value={bitstreams[props.selected_bitstream].name}/>
                <Button onClick={handle_open_file_chooser}>Change Bitstream File</Button>
            </FormLayout>
            <input type='file' id='bitstream_chooser' ref={inputFile} onChange={upload_file} style={{display: 'none'}}/>
        </SidebarBlockLayout>
    )
};

export default BitstreamEditSidebar;