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

import React from "react";
import {SelectField} from "#UI/index.js";
import {useAppSelector} from "#redux/hooks.js";
import type {SimpleNumberOption} from "#interfaces/index.js";

const NO_SCRIPT: SimpleNumberOption = {label: "None", value: -1};

interface ScriptSelectorProps {
    name: string;
    value: number | null;
    label?: string;
    // the label above the select, like the other fields of the cards that have them stacked
    stacked?: boolean;
    onChange: (script_id: number | null) => void;
}

/// Picks the script a macro or a parameter runs
export let ScriptSelector = (props: ScriptSelectorProps) =>{

    const scripts = useAppSelector(state => state.scripts);

    const options: SimpleNumberOption[] = [NO_SCRIPT, ...Object.values(scripts).map((script) => ({label: script.name, value: script.id}))];
    const selected = options.find(o => o.value === props.value) ?? NO_SCRIPT;

    return(
        <SelectField<SimpleNumberOption>
            label={props.label ?? "Script"}
            stacked={props.stacked ?? false}
            name={props.name}
            value={selected}
            options={options}
            onChange={(option) => props.onChange(option === null || option.value === NO_SCRIPT.value ? null : option.value)}
        />
    );
};
