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

import React, {useEffect, useState} from 'react';

import {Button, SelectableList, SimpleContent, UIPanel} from "#UI/index.js"
import type {application} from "#interfaces/index.js";


interface ApplicationChooserViewProps {
    applications: Record<number, application>;
    done: (application_id: number) => void;
}

const format_frequency = (hz: number | undefined) => {
    if(!hz) return null;
    return hz >= 1e6 ? (hz / 1e6) + " MHz" : (hz / 1e3) + " kHz";
}


let ApplicationChooserView = (props: ApplicationChooserViewProps) =>{

    const apps_list = Object.entries(props.applications).map(([id, app]) => ({
        id: parseInt(id),
        name: app.application_name,
        description: [
            format_frequency(app.clock_frequency),
            (app.peripherals?.length ?? 0) + " peripherals",
            app.bitstream
        ].filter(Boolean).join(" · ")
    }));

    const [selected, set_selected] = useState<number | null>(null);

    useEffect(()=>{
        let last_app = localStorage.getItem("last_selected_application");
        if(last_app && props.applications[parseInt(last_app)]){
            set_selected(parseInt(last_app));
        } else if(apps_list[0]) {
            set_selected(apps_list[0].id);
        }
    },[])

    let open = (id: number | null) =>{
        if(id === null) return;
        localStorage.setItem("last_selected_application", id.toString());
        props.done(id);
    };

    const id_from_name = (name: string) => apps_list.find(a => a.name === name)?.id ?? null;
    const selected_name = apps_list.find(a => a.id === selected)?.name;

    return(
        <UIPanel level="level_2" style={{width: "34rem", maxWidth: "95%", margin: "4rem auto", padding: "0.5em", maxHeight: "calc(100vh - 8rem)"}}>
            <SimpleContent name="Choose an application">
                <SelectableList
                    items={apps_list.map(a => a.name)}
                    variant="card"
                    descriptions={apps_list.map(a => a.description)}
                    selected_item={selected_name}
                    onSelect={name => set_selected(id_from_name(name))}
                    onActivate={name => open(id_from_name(name))}
                    style={{maxHeight: "calc(100vh - 18rem)", margin: "0.5em", width: "auto"}}
                />
                <div style={{display: "flex", justifyContent: "flex-end", padding: "0.5em"}}>
                    <Button onClick={() => open(selected)} disabled={selected === null}>Open application</Button>
                </div>
            </SimpleContent>
        </UIPanel>
    );

}


export default ApplicationChooserView;
