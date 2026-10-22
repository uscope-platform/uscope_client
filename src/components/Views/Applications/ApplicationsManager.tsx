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

import React, {useContext, useReducer, useState} from 'react';


import {
    PlotChannelProperties,
    PlotChannelGroupProperties,
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
import {ApplicationContext} from "#src/AuthApp.jsx";
import ApplicationSidebar from "./ApplicationSidebar.js";
import {ScriptSelector} from "#components/Views/Applications/Properties/ScriptSelector.js";
import {PeripheralsEditor} from "#components/Views/Applications/PeripheralsEditor.js";
import {ChannelGroupsEditor, ChannelsEditor, ParametersEditor} from "#components/Views/Applications/ChannelsEditor.js";
import {MdAdd} from "react-icons/md";
import {useAppSelector} from "#redux/hooks.js";


interface ApplicationsManagerProps {}

let  ApplicationsManager = (props: ApplicationsManagerProps) =>{

    const applications = useAppSelector(state => state.applications);
    const peripherals = useAppSelector(state => state.peripherals);
    const filters = useAppSelector(state => state.filters);
    const programs = useAppSelector(state => state.programs);
    const scripts = useAppSelector(state => state.scripts);

    // the page opens on the application in use
    const active_application = useContext(ApplicationContext);
    const [selected_app, set_selected_app] = useState(() => {
        const active = applications[active_application.id];
        return active !== undefined ? new up_application(active) : up_application.construct_empty(9999);
    });

    let [selectedTab, set_selectedTab] = useState(0);

    const [, forceUpdate] = useReducer(x => x + 1, 0);

    let handle_select = (app: number) =>{
        if(applications[app] === undefined) return;
        set_selected_app(new up_application(applications[app]));
    }

    // derived at every render, the scripts and the programs can change in the store while the page is open
    const selected_scripts = selected_app.scripts.flatMap((id) => scripts[id] !== undefined ? [scripts[id].name] : []);
    const available_scripts = Object.values(scripts).map((s) => s.name).filter((name) => !selected_scripts.includes(name));
    const selected_programs = selected_app.programs.flatMap((id) => programs[id] !== undefined ? [programs[id].name] : []);
    const available_programs = Object.values(programs).map((p) => p.name).filter((name) => !selected_programs.includes(name));

    let add_content = async (id: number, type: string) =>{
        switch (type) {
            case "channel_group":
                await selected_app.add_channel_group(id);
                break;
            case "channel":
                await selected_app.add_channel(id);
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


    // the beginning of the names the new items are given by add_* of up_application, the number after it is picked
    const NEW_ITEM_PREFIX: Record<string, string> = {
        channel: "new_channel_",
        channel_group: "new_group_",
        macro: "new_macro_",
        parameter: "new_parameter_",
        peripheral: "new_peripheral_",
        soft_core: "new_core_",
        misc: "new_parameter_"
    };

    let handle_add_new = (item_type: string, old_items: any, title_prop: string) =>{
        let taken: number[];
        if(item_type === "filter"){
            // the filters have a number as their id
            taken = Object.values(old_items).map((item: any) => item[title_prop] as number);
        } else {
            const prefix = NEW_ITEM_PREFIX[item_type] ?? "new_" + item_type + "_";
            // the fields of misc are the keys, the other items have a property with their name
            const names: string[] = item_type === "misc"
                ? Object.keys(old_items)
                : Object.values(old_items).map((item: any) => String(item[title_prop]));
            taken = names.flatMap((name) => {
                const suffix = name.startsWith(prefix) ? name.slice(prefix.length) : "";
                return /^\d+$/.test(suffix) ? [parseInt(suffix)] : [];
            });
        }

        add_content(get_next_id(taken), item_type);
    }



    const update_selection = (change: Promise<void>) =>{
        change.catch((e) => console.error(e)).finally(forceUpdate);
    }

    let handleDeselectScript = (id: string) => update_selection(selected_app.remove_selected_script(parseInt(id)));
    let handleSelectScript = (id: string) => update_selection(selected_app.add_selected_script(parseInt(id)));
    let handleDeselectPrograms = (id: string) => update_selection(selected_app.remove_selected_program(parseInt(id)));
    let handleSelectPrograms = (id: string) => update_selection(selected_app.add_selected_program(parseInt(id)));


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
                <TabbedContent names={["Channels", "Channel Groups", "Macro", "Parameters", "Peripherals", "Cores", "Misc", "Filters", "Scripts", "Programs"]}
                               selected={selectedTab} onSelect={set_selectedTab}>

                    <div key="channels">
                        <ChannelsEditor
                            application={selected_app}
                            forceUpdate={forceUpdate}
                            onAdd={() => {handle_add_new("channel", selected_app.channels, "name");}}
                        />
                    </div>
                    <div key="channel_groups">
                        <ChannelGroupsEditor
                            application={selected_app}
                            forceUpdate={forceUpdate}
                            onAdd={() => {handle_add_new("channel_group", selected_app.channel_groups, "group_name");}}
                        />
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
                        <ParametersEditor
                            application={selected_app}
                            forceUpdate={forceUpdate}
                            onAdd={() => {handle_add_new("parameter", selected_app.parameters, "parameter_name");}}
                        />
                    </div>
                    <div key="peripherals">
                        <PeripheralsEditor
                            application={selected_app}
                            peripherals={peripherals}
                            forceUpdate={forceUpdate}
                            onAdd={() => {handle_add_new("peripheral", selected_app.peripherals,"name");}}
                        />
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
                        <div style={{margin: "0.5em", maxWidth: "24rem"}}>
                            <ScriptSelector
                                stacked
                                label="Startup script"
                                name="init_script"
                                value={selected_app.init_script}
                                onChange={async (script_id) => {
                                    await selected_app.set_init_script(script_id);
                                    forceUpdate();
                                }}
                            />
                            <div style={{fontSize: "0.8rem", opacity: 0.6, marginTop: "0.25rem"}}>
                                Run when the application is loaded, before the scope and the cores are set up
                            </div>
                        </div>
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
