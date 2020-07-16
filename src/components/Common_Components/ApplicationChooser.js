import React, {useState} from 'react';

import {Button, Label, Select} from "../UI_elements"
import {useSelector} from "react-redux";
import styled from "styled-components";


const ComponentLayout = styled.div`
display: flex;
flex-direction: column;

`
const Centering = styled.div`
  margin-left: auto;
  margin-right: auto;  
`

const Title = styled.h1`
font-size: 2em;
`

let ApplicationChooser = props =>{

    const applications = useSelector(state => state.applications);
    const [chosen_application, set_chosen_application] = useState(null);

    let handle_change = (event) => {
        set_chosen_application(event.target.value);
    };

    let handle_close = (event) =>{
        let default_app = null;
        if(chosen_application)
            props.done(chosen_application);
        else
            default_app = Object.entries(applications)[0];
            props.done(default_app[0])
    };

    return(
        <ComponentLayout>
            <Centering>
                <Title>Application Choice</Title>
                <Label>Application Name</Label>
                <Select name="peripheral_type" onChange={handle_change}>
                    {Object.entries(applications).map((application,i) => (
                        <option key={i} >{application[0]}</option>
                    ))}
                </Select>
                <Button style={{margin:"1rem 1rem"}} onClick={handle_close}>Save changes</Button>
            </Centering>
        </ComponentLayout>
    );

}


export default ApplicationChooser;
