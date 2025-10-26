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

import ChannelSelector from "./ChannelSelector.js";
import PlotComponent from "./PlotComponent.js";
import ParametersArea from "./ParametersArea.js";
import MacroActions from "./MacroActions.js";
import {ColorTheme, UIPanel, SimpleContent} from "#UI/index.js";
import TerminalComponent from "./Terminal.js";
import PlotSidebar from "./Sidebar/PlotSidebar.js";
import {
    create_plot_channel,
    get_channels_from_group,
    update_plot_status,
    get_acquisition_status,
    empty_channel_group
} from "#client_core/index.js";
import useInterval from "../../Common_Components/useInterval.js";
import {ApplicationContext} from "#src/AuthApp.jsx";
import type {channel_group, plot_channel, ScopeStatus} from "#interfaces/index.js";

interface PlotTabProps {}

let PlotTab = function (props: PlotTabProps) {
    const application = useContext(ApplicationContext);

    const [plot_status, set_plot_status] = useState(false);
    const [plot_palette, set_plot_palette] = useState<{ colorway: string[] }>({colorway:[...ColorTheme.plot_palette]})
    const [external_data, set_external_data] = useState<plot_channel[]>([]);
    const [external_revision, bump_ext_revision] = useReducer(x => x+1, 0);
    const [request_download, set_request_download] = useState(0);
    const ch_group = application.get_default_channel_group();
    const [selected_group, set_selected_group] = useState(ch_group===undefined ? empty_channel_group.group_name : ch_group.group_name);
    let [acquisition_status, set_acquisition_status] = useState<ScopeStatus>("wait");


    const handle_group_change = async (group: channel_group) =>{
        let channels = get_channels_from_group(group, application.channels);

        let ch_obj: plot_channel[] = [];
        for(let item of channels){
            ch_obj.push(create_plot_channel(item))
        }
        set_external_data(ch_obj);
        bump_ext_revision();
        set_selected_group(group.group_name);
        await application.change_scope_channel_group(group);

    }

    let handle_channel_status_change = async (new_state: Record<number, boolean>) => {
        set_external_data(update_plot_status(external_data, new_state));
        let palette = [];
        for(let item in new_state){
            if(new_state[item]){
                let color = ColorTheme.plot_palette[parseInt(item)];
                if(color) palette.push(color);
            }
        }
        set_plot_palette({colorway: palette});
        bump_ext_revision();
        await application.setup_scope_statuses(new_state);
    }

    useInterval(async () => {
        if(!plot_status){
            await handle_update_acquisition_status();
        }
    },  650);

    let handle_update_acquisition_status = async ()=>{
        let status = await get_acquisition_status();
        set_acquisition_status(status);
    }

    return(
            <div style={{
                display:"flex",
                flexDirection:"row",
                gap:10
            }}>
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                    height: "100%"
                }}>
                    <div style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: 10,
                        width: "100%"
                    }}>
                        <UIPanel key="ch_selector" style={{flexGrow: 0.5}} level="level_2">
                            <SimpleContent name="Channel Selector">
                                <ChannelSelector
                                    data={external_data}
                                    on_channel_status_change={handle_channel_status_change}
                                />
                            </SimpleContent>
                        </UIPanel>
                        <UIPanel key="scope" style={{flexGrow: 1}} level="level_2">
                            <SimpleContent name="Scope">
                                <PlotComponent
                                    plot_status={plot_status}
                                    palette={plot_palette}
                                    external_data={external_data}
                                    on_data_init={set_external_data}
                                    external_revision={external_revision}
                                    request_download={request_download}
                                    on_update_acquisition_status={handle_update_acquisition_status}
                                    selected_group={selected_group}
                                />
                            </SimpleContent>
                        </UIPanel>
                    </div>

                    <div style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: 10,
                        minHeight: "300px"
                    }}>
                        <UIPanel style={{flexGrow: 0.4}} key="parameters" level="level_2">
                            <SimpleContent name="Parameters">
                                <ParametersArea
                                    parameters={application.parameters}
                                />
                            </SimpleContent>
                        </UIPanel>
                        <UIPanel style={{flexGrow: 1}} key="macro" level="level_2">
                            <SimpleContent name="Macro">
                                <MacroActions
                                    macro={application.macro}
                                />
                            </SimpleContent>
                        </UIPanel>
                    </div>
                    <UIPanel key="terminal" level="level_2">
                        <SimpleContent name="Terminal" height="25vh">
                            <TerminalComponent/>
                        </SimpleContent>
                    </UIPanel>
                </div>
                <PlotSidebar
                    on_plot_status_change={set_plot_status}
                    on_group_change={handle_group_change}
                    acquisition_status={acquisition_status}
                    on_download={set_request_download}
                />
            </div>

        );
};


export default PlotTab;
