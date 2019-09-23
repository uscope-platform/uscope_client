import React from 'react';

import {Button} from "react-bootstrap";


let  MacroActions = props =>{
    const Actions = [
        {name:"macro 1", trigger:'trigger_1'},
        {name:"macro 2", trigger:'trigger_2'},
        {name:"macro 3", trigger:'trigger_3'},
        {name:"macro 4", trigger:'trigger_4'},
        {name:"macro 5", trigger:'trigger_5'},
        {name:"macro 6", trigger:'trigger_6'},
        ];
    

    let onClick = (event) => {
        console.log(event.target.name);
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
