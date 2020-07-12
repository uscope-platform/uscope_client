import React, {useState} from 'react';

import styled from "styled-components";

import {useSelector} from "react-redux";
import {create_register} from "../../../utilities/PeripheralUtilities";

import BlockTitle from "../../UI_elements/BlockTitle";

import RegisterProperties from "../../UI_elements/RegisterProperties";
import InputField from "../../UI_elements/InputField";
import Label from "../../UI_elements/Label";
import SidebarContentLayout from "../../UI_elements/Layouts/SidebarContentLayout";
import PeripheralImage from "./PeripheralImage";



const RegistersView = styled.div`
  display: inherit;
  overflow-y: scroll;
  border-top-style: solid;
  border-top-color: #1d7097;
  border-top-width: 1px;
`
const TitleLayout = styled.div`
  margin-left: auto;
  margin-right: auto;
`


let  PeripheralEditSidebar = props =>{
    const peripherals = useSelector(state => state.peripherals);
    const settings = useSelector(state => state.settings);

    const [edit_label, set_edit_label] = useState(false);

    let handleAddRegister = (event) =>{
        if(event.key==="Enter"|| event.key ==="Tab"){
            let reg_name = event.target.value;
            let edit ={peripheral:settings.current_peripheral, action:"add_register",register:create_register(reg_name,"single")};
            settings.server.creator_proxy.edit_peripheral(edit);
        }
    }

    let handleEditImage = (image) =>{
        settings.server.creator_proxy.send_image(image);
        //SEND CHANGE COMMAND TO THE SERVER
        let edit ={peripheral:settings.current_peripheral, action:"change_image", path:image.name};
        settings.server.creator_proxy.edit_peripheral(edit);
    }

    let handleEditVersion = () =>{
        set_edit_label(true);
    }

    let handleEditVersionDone = (event) =>{
        if(event.key ==="Escape"){
            set_edit_label(false);
        } else if (event.key ==="Enter"){
            set_edit_label(false);
            let edit ={peripheral:settings.current_peripheral, action:"edit_version", version:parseFloat(event.target.value)};
            settings.server.creator_proxy.edit_peripheral(edit);
        }

    }


    if(!settings.current_peripheral)
        return <></>;

    return(
        <SidebarContentLayout>
            <TitleLayout>
                <BlockTitle>{peripherals[settings.current_peripheral].peripheral_name}</BlockTitle>
                {edit_label
                    ? <InputField compact name="edit_version" defaultValue={peripherals[settings.current_peripheral].version} onKeyDown={handleEditVersionDone} label="Version"/>
                    : <Label onDoubleClick={handleEditVersion}>{"Version: "+peripherals[settings.current_peripheral].version}</Label>
                }
            </TitleLayout>
            <PeripheralImage image={settings.server.server_url + peripherals[settings.current_peripheral].image} done={handleEditImage}/>

            <RegistersView>
                {
                    peripherals[settings.current_peripheral].registers.map((reg)=>{
                        return(
                            <RegisterProperties peripheral={settings.current_peripheral} register={reg}/>
                        )
                    })
                }
            </RegistersView>
            <InputField compact name="add_register" onKeyDown={handleAddRegister} label={"Add Register"}/>
        </SidebarContentLayout>
    );
};

export default PeripheralEditSidebar;
