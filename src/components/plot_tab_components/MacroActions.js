import React from 'react';

import {Button} from "react-bootstrap";
import {useSelector} from "react-redux";
import {parseFunction, context_cleaner} from "../../user_script_launcher";

let  MacroActions = props =>{

    const scripts = useSelector(
        state => state.scripts
    );

    const registers = useSelector(
        state => state.registerValues
    );

    const parameters = useSelector(
        state => state.parameterValues
    );

    const Actions = [
        {name:"macro 1", trigger:'trigger_1'},
        {name:"macro 2", trigger:'trigger_2'},
        {name:"macro 3", trigger:'trigger_3'},
        {name:"macro 4", trigger:'trigger_4'},
        {name:"macro 5", trigger:'trigger_5'},
        {name:"macro 6", trigger:'trigger_6'},
        ];
    

    let onClick = (event) => {
        let scriptTrigger = event.target.name;
        let trigger = scripts.filter((script)=>{
            return script.triggers.includes(scriptTrigger);
        });
        let content = trigger[0].script_content;
        debugger;

        let context = context_cleaner(registers, parameters, "");

        //TODO: DO SOMETHING WITH THE RETURN VALUE
        // eslint-disable-next-line
        let return_value = parseFunction(content)(null, context);
    };

    return(
        <div>
            {Actions.map((macro) => {
                return(
                    <Button className="macro_action_buttons" name={macro.trigger}  variant="primary" onClick={onClick}>{macro.name}</Button>
                );
            })}
        </div>
    );
};

export default MacroActions;
