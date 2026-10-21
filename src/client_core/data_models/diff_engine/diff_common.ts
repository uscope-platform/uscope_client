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

export type change_kind = "added" | "removed" | "modified";

export interface property_change {
    property: string;
    // undefined when the property does not exist on that side
    old_value: string | undefined;
    new_value: string | undefined;
}

/// One thing that changed (a register, a channel, ...), with the values that differ and what changed inside it
export interface diff_entry {
    kind: change_kind;
    label: string;
    // identifier shown next to the label when it tells something the label does not
    detail?: string;
    properties: property_change[];
    children: diff_entry[];
    note?: string;
}

/// The changes to one kind of thing (registers, channels, ...)
export interface diff_section {
    title: string;
    entries: diff_entry[];
}

/// What the user is shown when an imported item clashes with a stored one
export interface diff_report {
    properties: property_change[];
    sections: diff_section[];
    // things that are not in a single entry but the user has to know
    notes: string[];
}

export const report_is_empty = (report: diff_report): boolean => {
    return report.properties.length === 0 && report.sections.every(s => s.entries.length === 0) && report.notes.length === 0;
};

export const format_value = (value: unknown): string | undefined => {
    if (value === undefined) return undefined;
    if (typeof value === "string") return value;
    if (Array.isArray(value)) {
        if (value.length === 0) return "[ ]";
        return value.every(v => typeof v !== "object" || v === null) ? value.join(", ") : JSON.stringify(value);
    }
    return JSON.stringify(value);
};

export const diff_properties = (old_obj: Record<string, any>, new_obj: Record<string, any>, ignored: string[]): property_change[] => {
    const keys = [...new Set([...Object.keys(old_obj), ...Object.keys(new_obj)])].filter(k => !ignored.includes(k));
    const changes: property_change[] = [];
    for (const key of keys) {
        if (JSON.stringify(old_obj[key]) !== JSON.stringify(new_obj[key])) {
            changes.push({property: key, old_value: format_value(old_obj[key]), new_value: format_value(new_obj[key])});
        }
    }
    return changes;
};

/// True when the keys present on both sides are not in the same relative order
export const order_changed = (old_keys: string[], new_keys: string[]): boolean => {
    const in_new = new Set(new_keys);
    const in_old = new Set(old_keys);
    const common_old = old_keys.filter(k => in_new.has(k));
    const common_new = new_keys.filter(k => in_old.has(k));
    return common_old.some((k, i) => k !== common_new[i]);
};

export const index_by = <T>(items: T[], key: (item: T) => string): Map<string, T> => {
    return new Map(items.map(item => [key(item), item]));
};
