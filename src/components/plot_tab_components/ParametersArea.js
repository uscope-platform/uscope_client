import React from 'react';


import {Button, Form} from "react-bootstrap"
import {useSelector} from "react-redux";
import SingleValueField from "../Common_Components/SingleValueField";
import {parseFunction, context_cleaner} from "../../user_script_launcher";


let ParametersArea = props => {
    const parameters = useSelector(
        state => state.parameterValues
    );

    const scripts = useSelector(
        state => state.scripts
    );

    const registers = useSelector(
        state => state.registerValues
    );

    const handleSubmit = event => {
        event.preventDefault();
        for(let parameter of event.target){ // eslint-disable-line no-unused-vars
            //Parse parameter value and find out if it has changed
            let floatValue = parseFloat(parameter.value);
            let objIndex = parameters.findIndex((obj => obj.parameter_name === parameter.name));
            if(parameter.value!=="" && parameters[objIndex].value !==floatValue){
                //Retrive relevant script content
                let scriptTrigger = parameters[objIndex].trigger;
                let trigger = scripts.filter((script)=>{
                    return script.triggers.includes(scriptTrigger);
                });
                let content = trigger[0].script_content;

                //Parse the script into a callable function and execute it
                let context = context_cleaner(registers, parameters, parameter.name);
                //TODO: DO SOMETHING WITH THE RETURN VALUE
                // eslint-disable-next-line
                let return_value = parseFunction(content)(parameter.value, context);

            }
        }
    };

    return(
        <div className="parameters_area_containser">
            <Form onSubmit={handleSubmit}>
                {parameters.map((param, i) => {
                    if(param.visible){
                        return(
                            <SingleValueField key={i} name={param.parameter_name} value={param.value} description={param.description}/>
                        );
                    } else{
                        return null;
                    }
                })}
                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
        </div>
    );
};

export default ParametersArea;
