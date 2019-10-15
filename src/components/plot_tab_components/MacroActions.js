import React, {Component} from 'react';

import {Button} from "react-bootstrap";
import {connect} from "react-redux";
import {parseFunction, context_cleaner} from "../../user_script_launcher";

import {saveScriptsWorkspace} from "../../redux/Actions/scriptsActions";


function mapStateToProps(state) {
    return{
        scripts:state.scripts,
        settings:state.settings,
        applications:state.applications,
        registers:state.registerValues,
        parameters:state.parameterValues,
        workspace:state.scriptsWorkspace
    }
}

const mapDispatchToProps = dispatch => {
    return{
        saveScriptsWorkspace: (workspace) => {dispatch(saveScriptsWorkspace(workspace))},
    }
};


class MacroActions extends Component {
    constructor(props) {
        super(props);
        let application = props.applications[props.settings['application']];
        this.Actions = application['macro'];
    }

     onClick = (event) => {
         let scriptTrigger = event.target.name;
         let trigger = this.props.scripts.filter((script)=>{
             return script.triggers.includes(scriptTrigger);
         });
         let content = trigger[0].script_content;

         let context = context_cleaner(this.props.registers, this.props.parameters, "");
         context["workspace"] = this.props.workspace;
         let {workspace, registers} = parseFunction(content)(null, context);
         if(workspace!== null){
             this.props.saveScriptsWorkspace(workspace);
         }
         if(registers!== null){
             let bulk_registers = [];
             // eslint-disable-next-line
             for(let reg in registers){
                 let [periph_name, reg_name] = reg.split('.');
                 bulk_registers.push({name:reg_name, peripheral:periph_name, value:registers[reg]})
             }
             debugger;
             this.props.server.periph_proxy.bulkRegisterWrite({payload:bulk_registers});
         }
    };

     render (){
         return(
             <div>
                 {this.Actions.map((macro) => {
                     return(
                         <Button className="macro_action_buttons" name={macro.trigger}  variant="primary" onClick={this.onClick}>{macro.name}</Button>
                     );
                 })}
             </div>
         );
     }

};

export default connect(mapStateToProps, mapDispatchToProps)(MacroActions);