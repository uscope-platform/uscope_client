// Copyright 2026 Filippo Savi
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

import type {application} from "#interfaces/index.js";
import {
    diff_properties,
    index_by,
    type diff_entry,
    type diff_report,
    type diff_section,
    type property_change
} from "./diff_common.js";

/// What is needed to show the programs and the scripts, which an application only refers to by id, by their name
export interface application_diff_context {
    program_name?: (id: number) => string | undefined;
    script_name?: (id: number) => string | undefined;
}

/// The entries for the items of a list that are matched by a key: added, removed, or modified when a property changed.
/// The order of the list is not a change worth reporting for any of the lists of an application
const diff_keyed_list = <T extends Record<string, any>>(
    old_items: T[] | undefined,
    new_items: T[] | undefined,
    key: (item: T) => string,
    label: (item: T) => string,
    ignored: string[] = []
): diff_entry[] => {
    const old_by_key = index_by(old_items ?? [], key);
    const new_by_key = index_by(new_items ?? [], key);
    const entries: diff_entry[] = [];

    for (const [k, new_item] of new_by_key) {
        const old_item = old_by_key.get(k);
        if (old_item === undefined) {
            entries.push({kind: "added", label: label(new_item), properties: [], children: []});
            continue;
        }
        const properties = diff_properties(old_item, new_item, ignored);
        if (properties.length > 0) {
            entries.push({kind: "modified", label: label(new_item), properties, children: []});
        }
    }
    for (const [k, old_item] of old_by_key) {
        if (!new_by_key.has(k)) {
            entries.push({kind: "removed", label: label(old_item), properties: [], children: []});
        }
    }
    return entries;
};

/// The same for a list of ids of other resources (programs, scripts)
const diff_id_list = (
    old_ids: number[] | undefined,
    new_ids: number[] | undefined,
    label: (id: number) => string
): diff_entry[] => {
    const old_set = new Set(old_ids ?? []);
    const new_set = new Set(new_ids ?? []);
    return [
        ...[...new_set].filter(id => !old_set.has(id)).map((id): diff_entry => ({kind: "added", label: label(id), properties: [], children: []})),
        ...[...old_set].filter(id => !new_set.has(id)).map((id): diff_entry => ({kind: "removed", label: label(id), properties: [], children: []}))
    ];
};

/// A record (the clocks, the miscellaneous settings) as one property per key
const diff_record = (name: string, old_rec: Record<string, any> | undefined, new_rec: Record<string, any> | undefined): property_change[] => {
    const prefix = (changes: property_change[]) => changes.map(c => ({...c, property: name + "." + c.property}));
    return prefix(diff_properties(old_rec ?? {}, new_rec ?? {}, []));
};

const hex = (n: number) => "0x" + n.toString(16).toUpperCase();

/// What changes in an application when old_app is replaced by new_app. The id is not compared, as the replacement
/// takes the id of the old one
export const diff_applications = (old_app: application, new_app: application, context: application_diff_context = {}): diff_report => {
    const properties = [
        ...diff_properties(old_app, new_app, [
            "id", "channels", "channel_groups", "initial_registers_values", "macro", "parameters", "peripherals",
            "soft_cores", "filters", "programs", "scripts", "miscellaneous", "pl_clocks",
            // not stored, the clocks are in pl_clocks
            "clock_frequency"
        ]),
        ...diff_record("pl_clocks", old_app.pl_clocks, new_app.pl_clocks),
        ...diff_record("miscellaneous", old_app.miscellaneous, new_app.miscellaneous)
    ];

    const sections: diff_section[] = [
        {
            title: "Channels",
            entries: diff_keyed_list(old_app.channels, new_app.channels, c => c.id, c => c.name || c.id, ["id"])
        },
        {
            title: "Channel groups",
            entries: diff_keyed_list(old_app.channel_groups, new_app.channel_groups, g => g.group_id, g => g.group_name || g.group_id, ["group_id"])
        },
        {
            title: "Peripherals",
            entries: diff_keyed_list(old_app.peripherals, new_app.peripherals, p => p.peripheral_id, p => p.name || p.peripheral_id, ["peripheral_id"])
        },
        {
            title: "Parameters",
            entries: diff_keyed_list(old_app.parameters, new_app.parameters, p => p.parameter_id, p => p.parameter_name || p.parameter_id, ["parameter_id"])
        },
        {
            title: "Initial register values",
            entries: diff_keyed_list(old_app.initial_registers_values, new_app.initial_registers_values, v => String(v.address), v => "Register " + hex(v.address), ["address"])
        },
        {
            title: "Macros",
            entries: diff_keyed_list(old_app.macro, new_app.macro, m => m.name, m => m.name, ["name"])
        },
        {
            title: "Soft cores",
            entries: diff_keyed_list(old_app.soft_cores, new_app.soft_cores, c => c.id, c => "Core " + c.id, ["id"])
        },
        {
            title: "Filters",
            entries: diff_keyed_list(old_app.filters, new_app.filters, f => String(f.id), f => f.filter_name || String(f.id), ["id"])
        },
        {
            title: "Programs",
            entries: diff_id_list(old_app.programs, new_app.programs, id => context.program_name?.(id) ?? "Program " + id)
        },
        {
            title: "Scripts",
            entries: diff_id_list(old_app.scripts, new_app.scripts, id => context.script_name?.(id) ?? "Script " + id)
        }
    ];

    return {
        properties,
        sections: sections.filter(s => s.entries.length > 0),
        notes: []
    };
};
