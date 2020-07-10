import React from 'react';

import BlockTitle from "../UI_elements/BlockTitle";
import styled from "styled-components";
import Image from "../UI_elements/Image";
import Button from "../UI_elements/Button";
import RegisterProperties from "../UI_elements/RegisterProperties";
import {useSelector} from "react-redux";



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

let  Sidebar = props =>{
    const peripherals = useSelector(state => state.peripherals);
    const settings = useSelector(state => state.settings);

    let handleClick  = () =>{

    }

    if(!settings.current_peripheral)
        return <></>;

    return(
        <PeriphSidebarLayout>
            <BlockTitle>{peripherals[settings.current_peripheral].peripheral_name}</BlockTitle>
            <Image src={settings.server.server_url + peripherals[settings.current_peripheral].image} alt='add tab image' id="addImage" onClick={handleClick} fluid/>
            <RegistersView>
                {
                    peripherals[settings.current_peripheral].registers.map((reg)=>{
                        return(
                            <RegisterProperties peripheral={settings.current_peripheral} register={reg}/>
                        )
                    })
                }
            </RegistersView>
            <Button>+ Add Register</Button>
        </PeriphSidebarLayout>
    );
};

export default Sidebar;
