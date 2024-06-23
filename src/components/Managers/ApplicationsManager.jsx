// Copyright 2021 University of Nottingham Ningbo China
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

import React, {useReducer, useState} from 'react';

import {useSelector} from "react-redux"

import {
    UIPanel,
    PlotChannelProperties,
    PlotChannelGroupProperties,
    InitialRegisterValue,
    MacroProperties,
    ParameterProperties,
    PeripheralProperties,
    SoftCoreProperties,
    MiscFieldProperties,
    TabbedContent,
    CardStack,
    FilterProperties,
    TwoColumnSelector
} from "../UI_elements"

import {get_next_id, up_application} from "../../client_core";
import ManagerToolbar from "./ManagerToolbar";
import {InterfaceParameters} from "../UI_elements/InterfaceParameters";

const empty_app = {
    channels:[],
    channel_groups:[],
    initial_registers_values:[],
    macro:[],
    parameters:[],
    peripherals:[],
    soft_cores:[],
    filters:[],
    scripts:[],
    programs:[]
};

let  ApplicationsManager = props =>{

    const settings = useSelector(state => state.settings);
    const applications = useSelector(state => state.applications);
    const peripherals = useSelector(state => state.peripherals);
    const filters = useSelector(state => state.filters);
    const programs = useSelector(state => state.programs);
    const scripts = useSelector(state => state.scripts);

    const selected_app = settings.selected_application ?applications[settings.selected_application]: empty_app;

    let [selectedTab, set_selectedTab] = useState(0);

    const [, forceUpdate] = useReducer(x => x + 1, 0);

    const calculate_selected_scripts = () =>{
        return selected_app.scripts.map((scr)=>{
            if(scripts.hasOwnProperty(scr)){
                return scripts[scr].name;
            }
        });
    }

    const calculate_available_scripts = (sel_s)=>{
        return Object.values(scripts).filter((val)=>{
            return !sel_s.includes(val.name);
        }).map((scr)=>{
            return scr.name;
        })
    }

    const [selected_scripts, set_selected_scripts] = useState(calculate_selected_scripts())
    let [available_scripts,set_available_scripts] = useState(calculate_available_scripts(selected_scripts));

    const calculate_selected_programs = () =>{
        return selected_app.programs.map((prg)=>{
            if(programs.hasOwnProperty(prg)){
                return programs[prg].name;
            }
        });
    }


    const calculate_available_programs = (sel_p)=>{
        return Object.values(programs).filter((val)=>{
            return !sel_p.includes(val.name);
        }).map((prg)=>{
            return prg.name;
        })
    }

    const [selected_programs, set_selected_programs] = useState(calculate_selected_programs())
    let [available_programs,set_available_programs] = useState(calculate_available_programs(selected_programs));


    let add_content = (name, type) =>{
        let selected_application = new up_application(selected_app);
        switch (type) {
            case "channel_group":
                selected_application.add_channel_group(name).then();
                break;
            case "channel":
                selected_application.add_channel(name).then();
                break;
            case "irv":
                selected_application.add_irv(name).then();
                break;
            case"macro":
                selected_application.add_macro(name).then();
                break;
            case"parameter":
                selected_application.add_parameter(name).then();
                break;
            case"peripheral":
                selected_application.add_peripheral(name).then();
                break;
            case"soft_core":
                selected_application.add_soft_core(name).then();
                break;
            case "misc":
                selected_application.set_misc_param(name).then();
                break;
            case "filter":
                selected_application.add_filter(name).then();
                break;
            default:
                return;
        }
        forceUpdate();
    }


    let handle_add_new = (item_type, old_items, title_prop) =>{
        let ids = 3;
        if(item_type=== "irv"){
            add_content(0, item_type);
            return;
        } else if(item_type === "misc"){
            ids = Object.keys(old_items).map((item)=>{
                const regex = new RegExp("new_"+item_type+"_(\\d+)", 'g');
                let match = Array.from(item.matchAll(regex), m => m[1]);
                if(match.length>0){
                    return match;
                } else{
                    return null;
                }
            });
        } else {
             ids = Object.values(old_items).map((item)=>{
                const regex = new RegExp("new_"+item_type+"_(\\d+)", 'g');
                let match = Array.from(item[title_prop].matchAll(regex), m => m[1]);
                if(match.length>0){
                    return match;
                } else{
                    return null;
                }
            });
        }

        ids = ids.filter(Boolean);
        let name ="new_" + item_type + "_" + get_next_id(ids.sort());
        add_content(name, item_type);
    }



    let handleDeselectScript = (id) =>{
        let selected_application = new up_application(selected_app);
        selected_application.remove_selected_script(id).then(()=>{
            let sel_s = calculate_selected_scripts();
            let av_s = calculate_available_scripts(sel_s);
            set_selected_scripts(sel_s);
            set_available_scripts(av_s);
        });
    }

    let handleSelectScript = (id) =>{
        let app = new up_application(selected_app);
        app.add_selected_script(id).then(()=>{
            let sel_s = calculate_selected_scripts();
            let av_s = calculate_available_scripts(sel_s);
            set_selected_scripts(sel_s);
            set_available_scripts(av_s);
        });
    }


    let handleDeselectPrograms = (id) =>{
        let selected_application = new up_application(selected_app);
        selected_application.remove_selected_program(id).then(()=>{
            let sel_p = calculate_selected_programs();
            let av_p = calculate_available_programs(sel_p);
            set_selected_programs(sel_p);
            set_available_programs(av_p);
        });
    }

    let handleSelectPrograms = (id) =>{
        let app = new up_application(selected_app);
        app.add_selected_program(id).then(()=>{
            let sel_p = calculate_selected_programs();
            let av_p = calculate_available_programs(sel_p);
            set_selected_programs(sel_p);
            set_available_programs(av_p);
        });
    }


    let misc_obj={application_name:selected_app.application_name, bitstream: selected_app.bitstream, ...selected_app.miscellaneous}

    let get_tabs_content = ()=>{
        return([
            <div key="channels">
                <ManagerToolbar
                    onAdd={() =>{handle_add_new("channel", selected_app.channels, "name");}}
                    contentName="Channel"/>
                <CardStack>
                    {
                        selected_app.channels.map((channel)=>{
                            return(
                                <PlotChannelProperties
                                    key={channel.name}
                                    application={selected_app}
                                    forceUpdate={forceUpdate}
                                    channel={channel}
                                />
                            )
                        })
                    }
                </CardStack>
            </div>,
            <div key="channel_groups">
                <ManagerToolbar
                    onAdd={() =>{handle_add_new("channel_group", selected_app.channel_groups, "group_name");}}
                    contentName="Channel Group"/>
                <CardStack>
                    {
                        selected_app.channel_groups.map((group)=>{
                            return(
                                <PlotChannelGroupProperties
                                    key={group.name}
                                    application={selected_app}
                                    forceUpdate={forceUpdate}
                                    group={group}
                                />
                            )
                        })
                    }
                </CardStack>
            </div>,
            <div key="irvs">
                <ManagerToolbar
                    onAdd={() =>{handle_add_new("irv", selected_app.initial_registers_values,"address");}}
                    contentName="Initial Register Value"/>
                <CardStack>
                    {
                        selected_app.initial_registers_values.map((irv)=>{
                            return(
                                <InitialRegisterValue
                                    key={irv.address}
                                    application={selected_app}
                                    forceUpdate={forceUpdate}
                                    irv={irv}
                                />
                            )
                        })
                    }
                </CardStack>
            </div>,
            <div key="macros">
                <ManagerToolbar
                    onAdd={() =>{handle_add_new("macro", selected_app.macro,"name");}}
                    contentName="Macro"/>
                <CardStack>
                    {
                        selected_app.macro.map((macro)=>{
                            return(
                                <MacroProperties
                                    key={macro.name}
                                    application={selected_app}
                                    forceUpdate={forceUpdate}
                                    macro={macro}
                                />
                            )
                        })
                    }
                </CardStack>
            </div>,
            <div key="parameters">
                <ManagerToolbar
                    onAdd={() =>{handle_add_new("parameter", selected_app.parameters,"parameter_name");}}
                    contentName="Parameter"/>
                <CardStack>
                    {
                        selected_app.parameters.map((parameter)=>{
                            return(
                                <ParameterProperties
                                    key={parameter.name}
                                    application={selected_app}
                                    forceUpdate={forceUpdate}
                                    parameter={parameter}
                                />
                            )
                        })
                    }
                </CardStack>
            </div>,
            <div key="peripherals">
                <ManagerToolbar
                    onAdd={() =>{handle_add_new("peripheral", selected_app.peripherals,"name");}}
                                contentName="Peripheral"/>
                <CardStack>
                    {
                        selected_app.peripherals.map((peripheral)=>{
                            return(
                                <PeripheralProperties
                                    key={peripheral.name}
                                    application={selected_app}
                                    peripherals={peripherals}
                                    forceUpdate={forceUpdate}
                                    peripheral={peripheral}
                                />
                            )
                        })
                    }
                </CardStack>
            </div>,
            <div key="soft_cores">
                <ManagerToolbar
                    onAdd={() =>{handle_add_new("soft_core", selected_app.soft_cores, "id");}}
                    contentName="Soft Core"/>
                <CardStack>
                    {
                        selected_app.soft_cores.map((soft_core)=>{
                            return(
                                <SoftCoreProperties
                                    key={soft_core.id}
                                    application={selected_app}
                                    core={soft_core}
                                    programs={programs}
                                    forceUpdate={forceUpdate}
                                />
                            )
                        })
                    }
                </CardStack>
            </div>,
            <div key="misc_fields">
                <ManagerToolbar
                    onAdd={() =>{handle_add_new("misc", selected_app.miscellaneous, "name");}}
                    contentName="Miscellaneous Field"/>
                <CardStack>
                    {
                        Object.keys(misc_obj).map((key)=>{
                            return <MiscFieldProperties
                                key={key}
                                application={selected_app}
                                forceUpdate={forceUpdate}
                                name={key}
                                value={misc_obj[key]}
                            />
                        })
                    }
                </CardStack>
            </div>,
            <div key="filters_card">
                <ManagerToolbar
                    onAdd={() =>{handle_add_new("filter", selected_app.filters, "id");}}
                    contentName="Filters"/>
                <CardStack>
                    {
                        selected_app.filters.map((field)=>{
                            return <FilterProperties
                                key={field.id}
                                application={selected_app}
                                forceUpdate={forceUpdate}
                                filter={field}
                                filter_designs={filters}
                                peripherals={selected_app.peripherals}
                            />
                        })
                    }
                </CardStack>
            </div>,
            <div key="scripts_card">
                <TwoColumnSelector
                    itemType="Scripts"
                    data={scripts}
                    display_field="name"
                    selected_items={selected_scripts}
                    available_items={available_scripts}
                    onSelect={handleSelectScript}
                    onDeselect={handleDeselectScript}
                />
            </div>,
            <div key="programs_card">
                <TwoColumnSelector
                    itemType="Programs"
                    data={programs}
                    display_field="name"
                    selected_items={selected_programs}
                    available_items={available_programs}
                    onSelect={handleSelectPrograms}
                    onDeselect={handleDeselectPrograms}
                />
            </div>
        ])
    }

    let get_tabs_names = ()=>{
        return ["Channels", "Channel Groups","IRV", "Macro", "Parameters", "Peripherals", "Cores", "Misc", "Filters", "Scripts", "Programs"]
    }


    return (
        <UIPanel style={{
            height:"100%"
        }} level="level_2">
            <TabbedContent names={get_tabs_names()} contents={get_tabs_content()}
                           selected={selectedTab} onSelect={set_selectedTab}/>
        </UIPanel>
    );
};


export default ApplicationsManager;
