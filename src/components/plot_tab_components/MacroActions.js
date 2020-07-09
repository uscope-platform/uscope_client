import React from 'react';

import Button from "../UI_elements/Button"
import {useDispatch, useSelector} from "react-redux";
import {parseFunction, context_cleaner} from "../../user_script_launcher";

import {saveScriptsWorkspace} from "../../redux/Actions/scriptsActions";
import styled from "styled-components";
import BlockTitle from "../UI_elements/BlockTitle";
import BlockLayout from "../UI_elements/Layouts/BlockLayout";


const ButtonGrid = styled.div`
    display: grid;
    grid-template-columns: auto auto auto;
    grid-auto-rows: max-content;
    grid-row-gap: 1em;
`

let  MacroActions = props =>{
    const scripts = useSelector(state => state.scripts);

    const applications = useSelector(state => state.applications)
    const settings = useSelector(state => state.settings);
    const actions = applications[settings['application']]['macro']
    const registers_redux = useSelector(state => state.registerValues);
    const parameters = useSelector(state => state.parameterValues);
    const scripts_workspace = useSelector(state => state.scriptsWorkspace);
    const dispatch = useDispatch();

    let onClick = (event) => {
        let scriptTrigger = event.target.name;
        let trigger = scripts.filter((script)=>{
            return script.triggers.includes(scriptTrigger);
        });
        let content = trigger[0].script_content;

        let context = context_cleaner(registers_redux, parameters, "");
        context["workspace"] = scripts_workspace;
        let {workspace, registers} = parseFunction(content)(null, context);
        if(workspace!== null){
            dispatch(saveScriptsWorkspace(workspace))
        }
        if(registers!== null){
            let bulk_registers = [];
            // eslint-disable-next-line
            for(let reg in registers){
                let [periph_name, reg_name] = reg.split('.');
                bulk_registers.push({name:reg_name, peripheral:periph_name, value:registers[reg]})
            }
            props.server.periph_proxy.bulkRegisterWrite({payload:bulk_registers});
        }
    };

    return(
        <BlockLayout centered>
            <BlockTitle>Macro Area</BlockTitle>
            <ButtonGrid>
                {actions.map((macro) => {
                    return(
                        <Button key={macro.trigger} className="macro_action_buttons" name={macro.trigger} onClick={onClick}>{macro.name}</Button>
                    );
                })}
            </ButtonGrid>
        </BlockLayout>
    );
};

export default MacroActions;