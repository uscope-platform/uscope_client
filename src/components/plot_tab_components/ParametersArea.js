import React, {Component} from 'react';


import {Button, Form} from "react-bootstrap"
import {connect} from "react-redux";
import SingleValueField from "../Common_Components/SingleValueField";
import {parseFunction, context_cleaner} from "../../user_script_launcher";
import {saveScriptsWorkspace} from "../../redux/Actions/scriptsActions";
import {saveParameter} from "../../redux/Actions/ParameterActions";
import {setSetting} from "../../redux/Actions/SettingsActions";


function mapStateToProps(state) {
    return{
        scripts:state.scripts,
        registers:state.registerValues,
        parameters:state.parameterValues,
        scripts_workspace:state.scriptsWorkspace
    }
}

const mapDispatchToProps = dispatch => {
    return{
        setSettings: (setting) => {dispatch(setSetting(["application", setting]))},
        saveScriptsWorkspace: (workspace) => {dispatch(saveScriptsWorkspace(workspace))},
        saveParameter: (param) => {dispatch(saveParameter(param))}
    }
};

class ParametersArea extends Component {
    constructor(props){
        super(props);
        this.handleSubmit('initialization')
    }


    handleSubmit = event => {
        if(event==='initialization'){
            for(let elem of this.props.parameters){
                let scriptTrigger = elem.trigger;
                let trigger = this.props.scripts.filter((script)=>{
                    return script.triggers.includes(scriptTrigger);
                });
                if(trigger[0] ===undefined){
                    debugger;
                    continue;
                }
                let content = trigger[0].script_content;

                //Parse the script into a callable function and execute it
                let context = context_cleaner(this.props.registers, this.props.parameters, elem.parameter_name);
                context['workspace'] = this.props.scripts_workspace;
                let return_value = parseFunction(content)(elem.value, context);
                this.props.saveScriptsWorkspace(return_value);
            }
        } else {
            event.preventDefault();
            for(let parameter of event.target){ // eslint-disable-line no-unused-vars
                //Parse parameter value and find out if it has changed
                let floatValue = parseFloat(parameter.value);
                let objIndex = this.props.parameters.findIndex((obj => obj.parameter_name === parameter.name));
                if(parameter.value!=="" && this.props.parameters[objIndex].value !==floatValue){
                    //Retrive relevant script content
                    let scriptTrigger = this.props.parameters[objIndex].trigger;
                    let trigger = this.props.scripts.filter((script)=>{
                        return script.triggers.includes(scriptTrigger);
                    });
                    let content = trigger[0].script_content;

                    //Parse the script into a callable function and execute it
                    let context = context_cleaner(this.props.registers, this.props.parameters, parameter.name);
                    context['workspace'] = this.props.scripts_workspace;
                    let return_value = parseFunction(content)(floatValue, context);
                    this.props.saveScriptsWorkspace(return_value);
                    this.props.saveParameter({name:parameter.name, value:floatValue});
                }
            }
        }

    };
    render(){
        return(
            <div className="parameters_area_containser">
                <Form onSubmit={this.handleSubmit}>
                    {this.props.parameters.map((param, i) => {
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
    }

}

export default connect(mapStateToProps, mapDispatchToProps)(ParametersArea);