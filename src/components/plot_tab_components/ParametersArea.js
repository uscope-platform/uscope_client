import React from 'react';


import {Button, Form} from "react-bootstrap"
import {useSelector} from "react-redux";
import SingleValueField from "../Common_Components/SingleValueField";




    let parseFunction = function (string) {
        let funcReg = /function (\S*) *\(([^()]*)\)[ \n\t]*{(.*)}/gmi;
        let match = funcReg.exec(string.replace(/(\r\n|\n|\r)/gm, ""));
        if(match) {
            // eslint-disable-next-line
            return new Function(match[2].split(','), match[3]);
        }
        return null;
    };



let ParametersArea = props => {
    const parameters = useSelector(
        state => state.parameterValues
    );

    const scripts = useSelector(
        state => state.scripts
    );

    const handleSubmit = event => {
        event.preventDefault();
        let new_params = parameters;
        for(let parameter of event.target){ // eslint-disable-line no-unused-vars
            let objIndex = new_params.findIndex((obj => obj.parameter_name === parameter.name));
            let floatValue = parseFloat(parameter.value);
            if(parameter.value!=="" && new_params[objIndex].value !==floatValue){
                let scriptTrigger = new_params[objIndex].trigger;
                let trigger = scripts.filter((script)=>{
                    return script.triggers.includes(scriptTrigger);
                });
                let content = trigger[0].script_content;
                let func = parseFunction(content)(parameter.value);

            }
        }
    };

    return(
        <div className="parameters_area_containser">
            <Form onSubmit={handleSubmit}>
                {parameters.map((param, i) => {
                    return(
                        <SingleValueField key={i} name={param.parameter_name} value={param.value} description={param.description}/>
                    );
                })}
                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
        </div>
    );
};

export default ParametersArea;
