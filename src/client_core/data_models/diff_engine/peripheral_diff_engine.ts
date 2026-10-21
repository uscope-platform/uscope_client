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

import type {field, peripheral, register} from "#interfaces/index.js";
import {
    diff_properties,
    index_by,
    order_changed,
    type change_kind,
    type diff_entry,
    type diff_report,
    type property_change
} from "./diff_common.js";

export interface field_change {
    kind: change_kind;
    name: string;
    properties: property_change[];
}

export interface register_change {
    kind: change_kind;
    id: string;
    name: string;
    properties: property_change[];
    fields: field_change[];
    // the fields common to both sides are not in the same relative order: the offsets of the fields follow the order
    fields_reordered: boolean;
}

export interface peripheral_diff {
    properties: property_change[];
    registers: register_change[];
    // the registers common to both sides are not in the same relative order: the addresses of the registers follow the order
    registers_reordered: boolean;
}

export const diff_is_empty = (diff: peripheral_diff): boolean => {
    return diff.properties.length === 0 && diff.registers.length === 0 && !diff.registers_reordered;
};

const diff_fields = (old_fields: field[], new_fields: field[]): field_change[] => {
    const old_by_name = index_by(old_fields, f => f.name);
    const new_by_name = index_by(new_fields, f => f.name);
    const changes: field_change[] = [];

    for (const [name, new_field] of new_by_name) {
        const old_field = old_by_name.get(name);
        if (old_field === undefined) {
            changes.push({kind: "added", name, properties: diff_properties({}, new_field, ["name"])});
            continue;
        }
        const properties = diff_properties(old_field, new_field, ["name"]);
        if (properties.length > 0) changes.push({kind: "modified", name, properties});
    }
    for (const [name, old_field] of old_by_name) {
        if (!new_by_name.has(name)) {
            changes.push({kind: "removed", name, properties: diff_properties(old_field, {}, ["name"])});
        }
    }
    return changes;
};

const diff_registers = (old_registers: register[], new_registers: register[]): register_change[] => {
    const old_by_id = index_by(old_registers, r => r.ID);
    const new_by_id = index_by(new_registers, r => r.ID);
    const changes: register_change[] = [];

    for (const [id, new_register] of new_by_id) {
        const old_register = old_by_id.get(id);
        if (old_register === undefined) {
            changes.push({
                kind: "added",
                id,
                name: new_register.register_name,
                properties: [],
                fields: diff_fields([], new_register.fields),
                fields_reordered: false
            });
            continue;
        }
        const properties = diff_properties(old_register, new_register, ["ID", "fields"]);
        const fields = diff_fields(old_register.fields, new_register.fields);
        const fields_reordered = order_changed(old_register.fields.map(f => f.name), new_register.fields.map(f => f.name));
        if (properties.length > 0 || fields.length > 0 || fields_reordered) {
            changes.push({kind: "modified", id, name: new_register.register_name, properties, fields, fields_reordered});
        }
    }
    for (const [id, old_register] of old_by_id) {
        if (!new_by_id.has(id)) {
            changes.push({
                kind: "removed",
                id,
                name: old_register.register_name,
                properties: [],
                fields: diff_fields(old_register.fields, []),
                fields_reordered: false
            });
        }
    }
    return changes;
};

/// What changes in a peripheral when old_periph is replaced by new_periph. The id is not compared, as when the two
/// are the same peripheral the replacement takes the id of the old one. Registers are matched by their ID, fields by
/// their name
export const diff_peripherals = (old_periph: peripheral, new_periph: peripheral): peripheral_diff => {
    return {
        properties: diff_properties(old_periph, new_periph, ["id", "registers"]),
        registers: diff_registers(old_periph.registers, new_periph.registers),
        registers_reordered: order_changed(old_periph.registers.map(r => r.ID), new_periph.registers.map(r => r.ID))
    };
};

/// The diff as it is shown to the user
export const peripheral_diff_report = (diff: peripheral_diff): diff_report => {
    const field_entry = (f: field_change): diff_entry => ({
        kind: f.kind,
        label: "Field " + f.name,
        // the values of a whole added or removed field are not a change worth listing
        properties: f.kind === "modified" ? f.properties : [],
        children: []
    });
    const register_entry = (r: register_change): diff_entry => ({
        kind: r.kind,
        label: "Register " + r.name,
        ...(r.name !== r.id ? {detail: r.id} : {}),
        properties: r.properties,
        children: r.fields.map(field_entry),
        ...(r.fields_reordered ? {note: "field order changed"} : {})
    });
    const notes = diff.registers_reordered || diff.registers.some(r => r.fields_reordered)
        ? ["The order of the registers or fields differs. The addresses and offsets follow the order, so they would change even where the values are the same."]
        : [];
    return {
        properties: diff.properties,
        sections: [{title: "Registers", entries: diff.registers.map(register_entry)}],
        notes
    };
};
