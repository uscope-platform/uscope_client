import React from 'react';

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

let ApplicationChooserView = props =>{

    const applications = useSelector(state => state.applications);

    let handle_close = (event) =>{
        event.preventDefault();
        let app = event.target.application_selector.value;
        props.done(app);
    };

    return(
        <ComponentLayout>
            <Centering>
                <Title id='app_chooser_title'>Application Choice</Title>
                <Label>Application Name</Label>
                <form id='application_chooser_form' onSubmit={handle_close}>
                    <Select name="application_selector">
                        {Object.entries(applications).map((application,i) => (
                            <option value={application[0]} key={i} >{application[0]}</option>
                        ))}
                    </Select>
                    <Button style={{margin:"1rem 1rem"}} name='application_chooser_submit' type="submit">Save changes</Button>
                </form>
            </Centering>
        </ComponentLayout>
    );

}


export default ApplicationChooserView;
