import React from 'react';

import {BlockLayout, BlockTitle, Button} from "../UI_elements"
import {useDispatch, useSelector} from "react-redux";
import {context_cleaner, parseFunction} from "../../user_script_launcher";

import {saveScriptsWorkspace} from "../../redux/Actions/scriptsActions";
import styled from "styled-components";


const ButtonGrid = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-items: center;
    gap: 1em;
`

let  MacroActions = props =>{
    const scripts = useSelector(state => state.scripts);

    const applications = useSelector(state => state.applications)
    const settings = useSelector(state => state.settings);
    const actions = applications[settings['application']]['macro']
    const registers_redux = useSelector(state => state.registerValues);
    let parameters = applications[settings["application"]].parameters;
    const scripts_workspace = useSelector(state => state.scriptsWorkspace);
    const dispatch = useDispatch();

    let onClick = (event) => {
        let scriptTrigger = event.target.name;

        let trigger = Object.values(scripts).filter((script)=>{
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
            settings.server.periph_proxy.bulkRegisterWrite({payload:bulk_registers});
        }
    };

    return(
        <BlockLayout centered>
            <BlockTitle>Macros</BlockTitle>
            <ButtonGrid>
                {actions.map((macro) => {
                    return(
                        <div style={{margin:'0.5rem'}}>
                            <Button key={macro.trigger} className="macro_action_buttons" name={macro.trigger} onClick={onClick}>{macro.name}</Button>
                        </div>
                    );
                })}
            </ButtonGrid>
        </BlockLayout>
    );
};

export default MacroActions;