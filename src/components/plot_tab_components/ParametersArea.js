import React, {useEffect} from 'react';

import Button from "../UI_elements/Button"
import {useDispatch, useSelector} from "react-redux";
import SingleValueField from "../Common_Components/SingleValueField";
import {context_cleaner, parseFunction} from "../../user_script_launcher";
import {saveScriptsWorkspace} from "../../redux/Actions/scriptsActions";
import {saveParameter} from "../../redux/Actions/ParameterActions";

import FormLayout from "../UI_elements/Layouts/FormLayout";
import BlockLayout from "../UI_elements/Layouts/BlockLayout";
import BlockTitle from "../UI_elements/BlockTitle";


let  ParametersArea = props =>{
    const scripts = useSelector(state => state.scripts);
    const settings = useSelector(state => state.settings);
    const registers_redux = useSelector(state => state.registerValues);
    const parameters = useSelector(state => state.parameterValues);
    const scripts_workspace = useSelector(state => state.scriptsWorkspace);
    const dispatch = useDispatch();

    //This effect hook initialized the parameters values
    useEffect(() => {
        for(let elem of parameters){
            let scriptTrigger = elem.trigger;
            let trigger = scripts.filter((script)=>{
                return script.triggers.includes(scriptTrigger);
            });
            if(trigger[0] ===undefined){
                continue;
            }
            let content = trigger[0].script_content;

            //Parse the script into a callable function and execute it
            let context = context_cleaner(registers_redux, parameters, elem.parameter_name);
            context['workspace'] = scripts_workspace;
            let {workspace, registers} = parseFunction(content)(elem.value, context);
            if(workspace!== null){
                dispatch(saveScriptsWorkspace(workspace))
            }
            if(registers!== null){
                // eslint-disable-next-line
                for(let reg in registers){
                    let [periph_name, reg_name] = reg.split('.');
                    settings.server.periph_proxy.setRegisterValue({name:reg_name, peripheral:periph_name, value:registers[reg]});
                }
            }
        }
    }, []);


    let handleSubmit = event => {
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
                if(trigger[0]!==undefined){
                    let content = trigger[0].script_content;

                    //Parse the script into a callable function and execute it
                    let context = context_cleaner(registers_redux, parameters, parameter.name);
                    context['workspace'] = scripts_workspace;
                    let {workspace, registers} = parseFunction(content)(floatValue, context);
                    if(workspace!== null){
                        dispatch(saveScriptsWorkspace(workspace))
                    }
                    if(registers!== null){
                        // eslint-disable-next-line
                        for(let reg in registers){
                            let [periph_name, reg_name] = reg.split('.');
                            settings.server.periph_proxy.setRegisterValue({name:reg_name, peripheral:periph_name, value:registers[reg]});
                        }
                    }
                }
                dispatch(saveParameter({name:parameter.name, value:floatValue}))
            }
        }
    };

    return(
        <BlockLayout>
            <BlockTitle>Parameter Area</BlockTitle>
            <form onSubmit={handleSubmit}>
                <FormLayout>
                    {parameters.map((param, i) => {
                        if(param.visible){
                            return(
                                <SingleValueField key={i} name={param.parameter_name} value={param.value} description={param.description}/>
                            );
                        } else{
                            return null;
                        }
                    })}
                    <Button> Submit </Button>
                </FormLayout>
            </form>
        </BlockLayout>
    );
};

export default ParametersArea;