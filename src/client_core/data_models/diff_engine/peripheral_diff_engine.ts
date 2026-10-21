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

export type change_kind = "added" | "removed" | "modified";

export interface property_change {
    property: string;
    // undefined when the property does not exist on that side
    old_value: string | undefined;
    new_value: string | undefined;
}

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

const format_value = (value: unknown): string | undefined => {
    if (value === undefined) return undefined;
    if (typeof value === "string") return value;
    if (Array.isArray(value)) return value.length === 0 ? "[ ]" : value.join(", ");
    return JSON.stringify(value);
};

const diff_properties = (old_obj: Record<string, any>, new_obj: Record<string, any>, ignored: string[]): property_change[] => {
    const keys = [...new Set([...Object.keys(old_obj), ...Object.keys(new_obj)])].filter(k => !ignored.includes(k));
    const changes: property_change[] = [];
    for (const key of keys) {
        if (JSON.stringify(old_obj[key]) !== JSON.stringify(new_obj[key])) {
            changes.push({property: key, old_value: format_value(old_obj[key]), new_value: format_value(new_obj[key])});
        }
    }
    return changes;
};

const order_changed = (old_keys: string[], new_keys: string[]): boolean => {
    const in_new = new Set(new_keys);
    const in_old = new Set(old_keys);
    const common_old = old_keys.filter(k => in_new.has(k));
    const common_new = new_keys.filter(k => in_old.has(k));
    return common_old.some((k, i) => k !== common_new[i]);
};

const index_by = <T>(items: T[], key: (item: T) => string): Map<string, T> => {
    return new Map(items.map(item => [key(item), item]));
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
