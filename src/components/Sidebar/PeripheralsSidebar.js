import React from 'react';

import BlockTitle from "../UI_elements/BlockTitle";
import styled from "styled-components";
import Image from "../UI_elements/Image";
import RegisterProperties from "../UI_elements/RegisterProperties";
import {useSelector} from "react-redux";
import InputField from "../UI_elements/InputField";

import create_register from "../../utilities/Peripheral";
import Label from "../UI_elements/Label";


const PeriphSidebarLayout = styled.div`
  display: grid;
  height: 100vh;
  grid-template-columns: 1fr;
  grid-auto-rows: 1fr 3fr minmax(1fr, 10fr) 1fr;
  grid-gap: 0.5rem;
  margin-left: 0.8rem;
  margin-right: 0.8rem;
  justify-items: center;
`

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


let  Sidebar = props =>{
    const peripherals = useSelector(state => state.peripherals);
    const settings = useSelector(state => state.settings);

    let handleAddRegister = (event) =>{
        if(event.key==="Enter"|| event.key ==="Tab"){
            let reg_name = event.target.value;
            let edit ={peripheral:settings.current_peripheral, action:"add_register",register:create_register(reg_name,"single")};
            settings.server.creator_proxy.edit_peripheral(edit);
        }
    }

    let handleEditImage = (event) =>{
        //RETRIVE AND SEND IMAGE TO SERVER
        let image = event.target.files[0];
        settings.server.creator_proxy.send_image(image);
        //SEND CHANGE COMMAND TO THE SERVER
        let edit ={peripheral:settings.current_peripheral, action:"change_image", path:image.name};
        settings.server.creator_proxy.edit_peripheral(edit);
    }

    if(!settings.current_peripheral)
        return <></>;

    return(
        <PeriphSidebarLayout>
            <TitleLayout>
                <BlockTitle>{peripherals[settings.current_peripheral].peripheral_name}</BlockTitle>
                <label>{"Version: "+peripherals[settings.current_peripheral].version}</label>
            </TitleLayout>
            <div>
                <label htmlFor="image_choice">
                    <Image src={settings.server.server_url + peripherals[settings.current_peripheral].image} alt='add tab image' id="addImage" fluid/>
                </label>
                <input id="image_choice" type="file" style={{display: "none"}} onInput={handleEditImage}/>
            </div>

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
        </PeriphSidebarLayout>
    );
};

export default Sidebar;
