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

import React from 'react';

import {ItemsEditor} from "#UI/index.js";
import {PeripheralProperties} from "#components/Views/Applications/Properties/index.js";
import type {up_application, up_peripheral} from "#client_core/index.js";

interface PeripheralsEditorProps {
    application: up_application;
    peripherals: Record<number, up_peripheral>;
    forceUpdate: () => void;
    onAdd: () => void;
}

/// The peripherals of an application, which can be dozens of them
export let PeripheralsEditor = (props: PeripheralsEditorProps) =>{

    const ip_name = (spec_id: string) => props.peripherals[parseInt(spec_id)]?.name;

    // by name, with the numbers inside compared as numbers (new_peripheral_2 before new_peripheral_10)
    const sorted = [...props.application.peripherals].sort((a, b) => a.name.localeCompare(b.name, undefined, {numeric: true}));

    return(
        <ItemsEditor
            items={sorted}
            noun="peripherals"
            name={p => p.name}
            description={p => [ip_name(p.spec_id), p.base_address].filter(Boolean).join(" · ")}
            onAdd={props.onAdd}
            onRemove={async p => {
                await props.application.remove_peripheral(p.name);
                props.forceUpdate();
            }}
        >
            {p => <PeripheralProperties
                application={props.application}
                peripherals={props.peripherals}
                forceUpdate={props.forceUpdate}
                peripheral={p}
            />}
        </ItemsEditor>
    );
};
