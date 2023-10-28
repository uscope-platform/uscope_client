// Copyright 2023 Filippo Savi
// Author: Filippo Savi <filssavi@gmail.com>
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import React, {useReducer} from 'react';

import {Responsive, WidthProvider} from "react-grid-layout";
import {InputField, SelectField, SimpleContent, UIPanel} from "../../UI_elements";
import {useDispatch, useSelector} from "react-redux";
import {MdAdd} from "react-icons/md";
import {up_emulator} from "../../../client_core";
import {setSetting} from "../../../redux/Actions/SettingsActions";

let  EmulatorNodeProperties = props =>{

    const emulators_store = useSelector(state => state.emulators);
    const settings = useSelector(state => state.settings);
    const selected_component_obj = settings.emulator_selected_component;

    const sel_component_type = selected_component_obj ? selected_component_obj.type : null;

    let selected_component = null;

    const selected_emulator = settings.selected_emulator ? new up_emulator(emulators_store[parseInt(settings.selected_emulator)]): null;

    const [, forceUpdate] = useReducer(x => x + 1, 0);
    const dispatch = useDispatch();

    if(sel_component_type === "node"){
        selected_component = Object.values(emulators_store[parseInt(settings.selected_emulator)].cores).filter((item)=>{
            return item.id === selected_component_obj.obj.id;
        })[0];


        let handle_change = (event) =>{
            if(event.key==="Enter"|| event.key ==="Tab") {
                let field = event.target.name;
                let value = event.target.value;
                if(field === "program"){
                    let comps = event.target.value.split(".");
                    value = {filename: event.target.value, type:comps[1]}
                }
                if(field === "order" || field === "channels") value = parseInt(value);
                if(field==="efi_implementation"||field==="comparators"){
                    value = selected_component.options;
                    value[field] = event.target.value;
                    field = "options";
                }
                selected_emulator.edit_core_props(settings.emulator_selected_component.obj.id, field, value).then();
            }
        }

        let handle_change_iom = (event) =>{
            if(event.key==="Enter"|| event.key ==="Tab") {
                let field = event.target.name;
                let value = event.target.value;

                if(field === "reg_n" || field === "channel") value = parseInt(value);

                if (settings.emulator_selected_iom.type === 'inputs') {
                    selected_emulator.edit_input(settings.emulator_selected_component.obj.id,
                        field, value, settings.emulator_selected_iom.obj).then(()=>{
                        if(field === 'name'){
                            dispatch(setSetting(["emulator_selected_iom", {type:settings.emulator_selected_iom.type, obj:value}]));
                        }
                        forceUpdate();
                    });
                } else if (settings.emulator_selected_iom.type === 'outputs') {
                    selected_emulator.edit_output(settings.emulator_selected_component.obj.id,
                        field, value, settings.emulator_selected_iom.obj).then(()=>{
                        if(field === 'name'){

                            dispatch(setSetting(["emulator_selected_iom", {type:settings.emulator_selected_iom.type, obj:value}]));
                        }
                        forceUpdate();
                    });
                } else if (settings.emulator_selected_iom.type === 'memory_init') {
                    selected_emulator.edit_memory(settings.emulator_selected_component.obj.id,
                        field, value, settings.emulator_selected_iom.obj).then(()=>{
                        if(field === 'name'){
                            dispatch(setSetting(["emulator_selected_iom", {type:settings.emulator_selected_iom.type, obj:value}]));
                        }
                        forceUpdate();
                    });
                }
            }
        };

        let handle_change_type = (event) =>{
            if (settings.emulator_selected_iom.type === 'inputs') {
                selected_emulator.edit_input(settings.emulator_selected_component.obj.id,
                    "type", event.value, settings.emulator_selected_iom.obj).then(()=>{
                    forceUpdate();
                });
            } else if (settings.emulator_selected_iom.type === 'outputs') {
                selected_emulator.edit_output(settings.emulator_selected_component.obj.id,
                    "type", event.value, settings.emulator_selected_iom.obj).then(()=>{
                    forceUpdate();
                });
            } else if (settings.emulator_selected_iom.type === 'memory_init') {
                selected_emulator.edit_memory(settings.emulator_selected_component.obj.id,
                    "type", event.value, settings.emulator_selected_iom.obj).then(()=>{
                    forceUpdate();
                });
            }
        }

        let render_io_props = ()=>{
            if(!settings.emulator_selected_iom) return ;
            let panel_content = [];
            let panel_name = "Properties";
            if(settings.emulator_selected_iom.type === "inputs"){
                let sel_in = selected_component.inputs.filter((item)=>{
                    return item.name === settings.emulator_selected_iom.obj
                })[0];
                panel_content.push(
                    <div key="input_props">
                        <InputField ID="name" name="name" label="Name" defaultValue={sel_in.name} onKeyDown={handle_change_iom}/>
                        <InputField ID="channel" name="channel" label="Channel" defaultValue={sel_in.channel} onKeyDown={handle_change_iom}/>
                        <InputField ID="reg_n" name="reg_n" label="Register #" defaultValue={sel_in.reg_n} onKeyDown={handle_change_iom}/>
                        <SelectField
                            inline
                            label="Type"
                            onChange={handle_change_type}
                            value={{value: sel_in.type, label: sel_in.type}}
                            defaultValue="Select Type"
                            name="type"
                            options={[
                                {label: "float", value: "float"},
                                {label: "integer", value: "integer"}
                            ]}
                        />
                    </div>
                );
                panel_name = "Input Properties"
            } else if(settings.emulator_selected_iom.type === "outputs") {
                let sel_out = selected_component.outputs.filter((item)=>{
                    return item.name === settings.emulator_selected_iom.obj
                })[0];
                panel_content.push(
                    <div key="output_props">
                        <InputField inline ID="name" name="name" label="Name" defaultValue={sel_out.name} onKeyDown={handle_change_iom}/>
                        <InputField inline ID="reg_n" name="reg_n" label="Register #" defaultValue={sel_out.reg_n} onKeyDown={handle_change_iom}/>
                        <SelectField
                            inline
                            label="Type"
                            onChange={handle_change_type}
                            value={{value: sel_out.type, label: sel_out.type}}
                            defaultValue="Select Type"
                            name="type"
                            options={[
                                {label: "float", value: "float"},
                                {label: "integer", value: "integer"}
                            ]}
                        />
                    </div>
                );
                panel_name = "Output Properties";
            } else if(settings.emulator_selected_iom.type === "memory_init") {
                let sel_mem = selected_component.memory_init.filter((item)=>{
                    return item.name === settings.emulator_selected_iom.obj
                })[0];
                panel_content.push(
                    <div key="memory_props">
                        <InputField inline ID="name" name="name" label="Name" defaultValue={sel_mem.name} onKeyDown={handle_change_iom}/>
                        <InputField inline ID="reg_n" name="reg_n" label="Register #" defaultValue={sel_mem.reg_n} onKeyDown={handle_change_iom}/>
                        <SelectField
                            inline
                            label="Type"
                            onChange={handle_change_type}
                            value={{value: sel_mem.type, label: sel_mem.type}}
                            defaultValue="Select Type"
                            name="type"
                            options={[
                                {label: "float", value: "float"},
                                {label: "integer", value: "integer"}
                            ]}
                        />
                        <InputField inline ID="value" name="value" label="Value" defaultValue={sel_mem.value} onKeyDown={handle_change_iom}/>
                    </div>
                );
                panel_name = "Memory Properties";
            }

            return(
                <SimpleContent name={panel_name} content={panel_content}/>
            )

        }


        const ResponsiveGridLayout = WidthProvider(Responsive);

        return(
            <ResponsiveGridLayout
                className="layout"
                breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                cols={{ lg: 24, md: 20, sm: 12, xs: 8, xxs: 4 }}
                useCSSTransforms={false}
            >
                <UIPanel key={"Item properties"} data-grid={{x: 0, y: 0, w: 24, h: 2, static: true}} level="level_2">
                    {
                        <SimpleContent name={"Node Properties"} content={
                            <div key="node_props">
                                <InputField inline ID="name" name="name" label="Core Name" defaultValue={selected_component.name} onKeyDown={handle_change}/>
                                <InputField inline ID="channels" name="channels" label="Channels #" defaultValue={selected_component.channels} onKeyDown={handle_change}/>
                                <InputField inline ID="program" name="program" label="Program" defaultValue={selected_component.program.filename} onKeyDown={handle_change}/>
                                <InputField inline ID="input_file" name="input_file" label="Input File" defaultValue={selected_component.input_file} onKeyDown={handle_change}/>
                                <InputField inline ID="order" name="order" label="Execution Order" defaultValue={selected_component.order} onKeyDown={handle_change}/>
                                <InputField inline ID="efi_implementation" name="efi_implementation" label="EFI" defaultValue={selected_component.options.efi_implementation} onKeyDown={handle_change}/>
                                <InputField inline ID="comparators" name="comparators" label="comparators" defaultValue={selected_component.options.comparators} onKeyDown={handle_change}/>
                            </div>
                        }
                        />
                    }
                </UIPanel>
                <UIPanel key={"iom properties"} data-grid={{x: 0, y: 2, w: 24, h: 2, static: true}} level="level_2">
                    {
                        render_io_props()
                    }
                </UIPanel>
            </ResponsiveGridLayout>
        );
    }

};

export default EmulatorNodeProperties;
