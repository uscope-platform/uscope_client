import React, {Component}  from 'react';

import {connect} from "react-redux"
import SidebarLayout from "../UI_elements/Layouts/SidebarLayout";
import BlockTitle from "../UI_elements/BlockTitle";
import styled from "styled-components";
import Image from "../UI_elements/Image";
import Button from "../UI_elements/Button";
import RegisterProperties from "../UI_elements/RegisterProperties";

function mapStateToProps(state) {
    return{
        modals:state.modals,
        settings:state.settings,
        peripherals:state.peripherals
    }
}

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


class Sidebar extends Component {

    render(){
        if(!this.props.settings.current_peripheral)
            return <></>;

        return(
            <PeriphSidebarLayout>
                <BlockTitle>{this.props.peripherals[this.props.settings.current_peripheral].peripheral_name}</BlockTitle>
                <Image src={this.props.server.server_url + this.props.peripherals[this.props.settings.current_peripheral].image} alt='add tab image' id="addImage" onClick={this.handleClick} fluid/>
                <RegistersView>
                    {
                        this.props.peripherals[this.props.settings.current_peripheral].registers.map((reg)=>{
                            return(
                                <RegisterProperties register={reg}/>
                            )
                        })
                    }
                </RegistersView>
                <Button>+ Add Register</Button>
            </PeriphSidebarLayout>
        );
    };
}

export default connect(mapStateToProps)(Sidebar);
