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

import React, {useEffect, useReducer, useState} from 'react';


import {
    PlotChannelProperties,
    PlotChannelGroupProperties,
    InitialRegisterValue,
    MacroProperties,
    ParameterProperties,
    PeripheralProperties,
    SoftCoreProperties,
    MiscFieldProperties,
    FilterProperties,
} from "../Applications/Properties/index.js"

import {
    TwoColumnSelector,
    CardStack,
    TabbedContent,
    ColorTheme,
    UIPanel
} from "#UI/index.js";

import {get_next_id, up_application} from "#client_core/index.js";
import ApplicationSidebar from "./ApplicationSidebar.js";
import {MdAdd} from "react-icons/md";
import {useAppSelector} from "#redux/hooks.js";


interface ApplicationsManagerProps {}

let  ApplicationsManager = (props: ApplicationsManagerProps) =>{

    const applications = useAppSelector(state => state.applications);
    const peripherals = useAppSelector(state => state.peripherals);
    const filters = useAppSelector(state => state.filters);
    const programs = useAppSelector(state => state.programs);
    const scripts = useAppSelector(state => state.scripts);

    const [selected_app, set_selected_app] = useState(up_application.construct_empty(9999));

    let [selectedTab, set_selectedTab] = useState(0);

    const [, forceUpdate] = useReducer(x => x + 1, 0);

    let handle_select = (app: number) =>{
        if(applications[app] === undefined) return;
        set_selected_app(new up_application(applications[app]));
    }

    const calculate_selected_scripts = () =>{
        return  selected_app.scripts.map((scr)=>{
            let script = scripts[scr];
            if(script === undefined) return;
            return script.name;
        }).filter((val)=>{return val !== undefined;})
    }

    const calculate_available_scripts = (sel_s: string[])=>{
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
            let program = programs[prg];
            if(program === undefined) return;
            return program.name;
        }).filter((val)=>{return val !== undefined;});
    }


    const calculate_available_programs = (sel_p : string[])=>{
        return Object.values(programs).filter((val)=>{
            return !sel_p.includes(val.name);
        }).map((prg)=>{
            return prg.name;
        })
    }

    const [selected_programs, set_selected_programs] = useState(calculate_selected_programs())
    let [available_programs,set_available_programs] = useState(calculate_available_programs(selected_programs));

    useEffect(() => {
        let new_selected_scripts = calculate_selected_scripts();
        let new_available_scripts = calculate_available_scripts(new_selected_scripts)

        let new_selected_programs = calculate_selected_programs();
        let new_available_programs = calculate_available_programs(new_selected_programs)

        set_selected_scripts(new_selected_scripts);
        set_available_scripts(new_available_scripts);
        set_selected_programs(new_selected_programs);
        set_available_programs(new_available_programs);
    }, [selected_app]);

    let add_content = async (id: number, type: string) =>{
        switch (type) {
            case "channel_group":
                await selected_app.add_channel_group(id);
                break;
            case "channel":
                await selected_app.add_channel(id);
                break;
            case "irv":
                await selected_app.add_irv(id);
                break;
            case"macro":
                await selected_app.add_macro(id);
                break;
            case"parameter":
                await selected_app.add_parameter(id);
                break;
            case"peripheral":
                await selected_app.add_peripheral(id);
                break;
            case"soft_core":
                await selected_app.add_soft_core(id);
                break;
            case "misc":
                await selected_app.set_misc_param(id);
                break;
            case "filter":
                await selected_app.add_filter(id);
                break;
            default:
                return;
        }
        forceUpdate();
    }


    let handle_add_new = (item_type: string, old_items: any, title_prop: string) =>{
        let ids: number[] =[];
        if(item_type=== "irv"){
            add_content(0, item_type);
            return;
        }else if(item_type === "misc"){
            ids = Object.keys(old_items).map((item)=>{
                const regex = new RegExp("new_parameter_(\\d+)", 'g');
                let match = Array.from(item.matchAll(regex), m => m[1]);
                if(match.length>0 && match[0] !== undefined){
                    return  parseInt(match[0]);
                } else{
                    return;
                }
            }).filter((id)=>{return id !== undefined;});
        } else {
             ids = Object.values(old_items).map((item: any)=>{
                const regex = new RegExp("new_"+item_type+"_(\\d+)", 'g');
                 let match = Array.from((item[title_prop] as string).matchAll(regex), m => m[1]);
                 if(match.length>0 && match[0] !== undefined){
                     return  parseInt(match[0]);
                 } else{
                     return;
                 }
            }).filter((id)=>{return id !== undefined;});
        }

        ids = ids.filter(Boolean);
        let selected_id = get_next_id(ids.sort())
        add_content(selected_id, item_type);
    }



    let handleDeselectScript = (id: string) =>{
        selected_app.remove_selected_script(parseInt(id)).then(()=>{
            let sel_s = calculate_selected_scripts();
            let av_s = calculate_available_scripts(sel_s);
            set_selected_scripts(sel_s);
            set_available_scripts(av_s);
        });
    }

    let handleSelectScript = (id: string) =>{
        selected_app.add_selected_script(parseInt(id)).then(()=>{
            let sel_s = calculate_selected_scripts();
            let av_s = calculate_available_scripts(sel_s);
            set_selected_scripts(sel_s);
            set_available_scripts(av_s);
        });
    }


    let handleDeselectPrograms = (id: string) =>{
        selected_app.remove_selected_program(parseInt(id)).then(()=>{
            let sel_p = calculate_selected_programs();
            let av_p = calculate_available_programs(sel_p);
            set_selected_programs(sel_p);
            set_available_programs(av_p);
        });
    }

    let handleSelectPrograms = (id: string) =>{
        selected_app.add_selected_program(parseInt(id)).then(()=>{
            let sel_p = calculate_selected_programs();
            let av_p = calculate_available_programs(sel_p);
            set_selected_programs(sel_p);
            set_available_programs(av_p);
        });
    }


    let misc_obj={application_name:selected_app.application_name, bitstream: selected_app.bitstream, ...selected_app.miscellaneous}


    return (
        <div style={{
            display: "flex",
            flexDirection: "row",
            gap:10,
            height:"100%"
        }}>
            <UIPanel style={{
                height:"100%",
                flexGrow:1
            }} level="level_2">
                <TabbedContent names={["Channels", "Channel Groups","IRV", "Macro", "Parameters", "Peripherals", "Cores", "Misc", "Filters", "Scripts", "Programs"]}
                               selected={selectedTab} onSelect={set_selectedTab}>

                    <div key="channels">
                        <div style={{display: "flex", marginRight: "0.5em", justifyContent: "right"}}>
                            <MdAdd
                                onClick={() => {handle_add_new("channel", selected_app.channels, "name");}}
                                size={ColorTheme.icons_size}
                                style={{marginLeft: "0.3em"}}
                                color={ColorTheme.icons_color}
                            />
                        </div>
                        <CardStack>
                            {
                                selected_app.channels.map((channel) => {
                                    return (
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
                    </div>
                    <div key="channel_groups">
                        <div style={{display: "flex", marginRight: "0.5em", justifyContent: "right"}}>
                            <MdAdd
                                onClick={() => {handle_add_new("channel_group", selected_app.channel_groups, "group_name");}}
                                size={ColorTheme.icons_size}
                                style={{marginLeft: "0.3em"}}
                                color={ColorTheme.icons_color}
                            />
                        </div>
                        <CardStack>
                            {
                                selected_app.channel_groups.map((group) => {
                                    return (
                                        <PlotChannelGroupProperties
                                            key={group.group_name}
                                            application={selected_app}
                                            forceUpdate={forceUpdate}
                                            group={group}
                                        />
                                    )
                                })
                            }
                        </CardStack>
                    </div>
                    <div key="irvs">
                        <div style={{display: "flex", marginRight: "0.5em", justifyContent: "right"}}>
                            <MdAdd
                                onClick={() => {handle_add_new("irv", selected_app.initial_registers_values, "address");}}
                                size={ColorTheme.icons_size}
                                style={{marginLeft: "0.3em"}}
                                color={ColorTheme.icons_color}
                            />
                        </div>
                        <CardStack>
                            {
                                selected_app.initial_registers_values.map((irv) => {
                                    return (
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
                    </div>
                    <div key="macros">
                        <div style={{display: "flex", marginRight: "0.5em", justifyContent: "right"}}>
                            <MdAdd
                                onClick={() => {handle_add_new("macro", selected_app.macro, "name");}}
                                size={ColorTheme.icons_size}
                                style={{marginLeft: "0.3em"}}
                                color={ColorTheme.icons_color}
                            />
                        </div>
                        <CardStack>
                            {
                                selected_app.macro.map((macro) => {
                                    return (
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
                    </div>
                    <div key="parameters">
                        <MdAdd
                            onClick={() => {handle_add_new("parameter", selected_app.parameters, "parameter_name");}}
                            size={ColorTheme.icons_size}
                            style={{marginLeft: "0.3em"}}
                            color={ColorTheme.icons_color}
                        />
                        <CardStack>
                            {
                                selected_app.parameters.map((parameter) => {
                                    return (
                                        <ParameterProperties
                                            key={parameter.parameter_id}
                                            application={selected_app}
                                            forceUpdate={forceUpdate}
                                            parameter={parameter}
                                        />
                                    )
                                })
                            }
                        </CardStack>
                    </div>
                    <div key="peripherals">
                        <MdAdd
                            onClick={() => {handle_add_new("peripheral", selected_app.peripherals,"name");}}
                            size={ColorTheme.icons_size}
                            style={{marginLeft: "0.3em"}}
                            color={ColorTheme.icons_color}
                        />
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
                    </div>
                    <div key="soft_cores">
                        <MdAdd
                            onClick={() => {handle_add_new("soft_core", selected_app.soft_cores, "id");}}
                            size={ColorTheme.icons_size}
                            style={{marginLeft: "0.3em"}}
                            color={ColorTheme.icons_color}
                        />
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
                    </div>
                    <div key="misc_fields">
                        <MdAdd
                            onClick={() => {handle_add_new("misc", selected_app.miscellaneous, "name");}}
                            size={ColorTheme.icons_size}
                            style={{marginLeft: "0.3em"}}
                            color={ColorTheme.icons_color}
                        />
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
                    </div>
                    <div key="filters_card">
                        <MdAdd
                            onClick={() => {handle_add_new("filter", selected_app.filters, "id");}}
                            size={ColorTheme.icons_size}
                            style={{marginLeft: "0.3em"}}
                            color={ColorTheme.icons_color}
                        />
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
                    </div>
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
                    </div>
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
                </TabbedContent>
            </UIPanel>
            <div style={{minWidth:"300px"}}>
                <ApplicationSidebar
                    on_select={handle_select}
                    application={selected_app}
                />
            </div>
        </div>
    );
};


export default ApplicationsManager;
