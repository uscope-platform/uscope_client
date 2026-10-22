// Copyright 2021 Filippo Savi
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

import Ajv2020 from "ajv/dist/2020.js"
import {up_application} from "#src/client_core/index.js";
import {up_peripheral} from "#src/client_core/index.js";
import {application_schema} from "./application_schema.js";
import {peripheral_schema} from "./peripheral_schema.js";
import store from "../../store.js";
import {addApplication} from "#redux/index.js";
import {get_next_id} from "#src/client_core/index.js";
import {
    diff_applications,
    diff_is_empty,
    diff_peripherals,
    peripheral_diff_report,
    report_is_empty,
    type application_diff_context,
    type diff_report
} from "../data_models/diff_engine/index.js";
import type {application, peripheral} from "#interfaces/index.js";

let validate_json = (obj: any, schema: object) => {
    const ajv = new Ajv2020();
    const validate = ajv.compile(schema)
    const valid = validate(obj)
    let erorr_strings = [];
    if(!valid && validate.errors){
        for(let i of validate.errors){
            erorr_strings.push('Error at: "' +i.instancePath + '" --- ' + i.message);
        }
    }
    return [valid, erorr_strings]
}

export type conflict_resolution = "keep_old" | "use_new" | "keep_both";

/// The name an imported item gets next to the stored one it clashes with: the suffix tells the two apart
const IMPORTED_SUFFIX = "_imported";

const unique_name = (taken: string[], name: string): string => {
    if(!taken.includes(name)) return name;
    let candidate = name + IMPORTED_SUFFIX;
    for(let n = 2; taken.includes(candidate); n++){
        candidate = name + IMPORTED_SUFFIX + "_" + n;
    }
    return candidate;
};

const free_id = (taken: number[]): number => get_next_id(taken);

////////////////////////////////////////////////     APPLICATIONS

export interface application_conflict {
    existing: application;
    incoming: application;
    report: diff_report;
    // the name the imported application gets if both are kept
    keep_both_name: string;
    index: number;
    total: number;
}

export type application_import_outcome = "added" | "replaced" | "kept_both" | "kept_old" | "unchanged";

export interface application_import_result {
    outcome: application_import_outcome;
    // the name the application has in the end
    name: string;
}

const normalize_application = (app: application): application => {
    return new up_application(app).get_raw_obj() as unknown as application;
};

const stored_applications = (): application[] => {
    return Object.values(store.getState().applications).map(a => normalize_application(a as unknown as application));
};

// the programs and the scripts of an application are only ids, the diff shows their names
const application_diff_context_from_store = (): application_diff_context => {
    const state = store.getState();
    return {
        program_name: (id) => state.programs[id]?.name,
        script_name: (id) => state.scripts[id]?.name
    };
};

export const parse_application = (raw_json: string, id: number): application => {
    let imported_app = JSON.parse(raw_json);
    imported_app["id"] = id;
    let [valid, errors] = validate_json(imported_app, application_schema);
    if(imported_app.miscellaneous === undefined){
        imported_app.miscellaneous =  {}
    }
    if(!valid){
        throw errors;
    }
    // the client handles the id of the specification as a string, the older files have an integer
    for(const p of imported_app.peripherals){
        p.spec_id = String(p.spec_id);
        // the dot separates the peripheral from the register in the terminal and in the scripts, ananke puts one in
        // the names of the instances of an array ("core.0")
        p.name = p.name.replace(/\./g, "_");
        p.peripheral_id = p.peripheral_id.replace(/\./g, "_");
    }
    return imported_app;
}

/// Imports an application. The name is what identifies an application for the user (the id of the file is
/// meaningless on another installation, so it is never used), when a stored application has the same name and is
/// different resolve_conflict decides what to do, nothing is written before it answers. Importing the same
/// application that is already stored does nothing.
export const import_application = async (
    raw_json: string,
    resolve_conflict: (conflict: application_conflict) => Promise<conflict_resolution>
): Promise<application_import_result> => {
    const stored = stored_applications();
    const new_id = free_id(stored.map(a => a.id));
    const incoming = normalize_application(parse_application(raw_json, new_id));
    const existing = stored.find(a => a.application_name === incoming.application_name);

    if(existing === undefined){
        await new up_application(incoming).add_remote();
        return {outcome: "added", name: incoming.application_name};
    }

    const report = diff_applications(existing, incoming, application_diff_context_from_store());
    if(report_is_empty(report)){
        return {outcome: "unchanged", name: existing.application_name};
    }

    const keep_both_name = unique_name(stored.map(a => a.application_name), incoming.application_name);
    const resolution = await resolve_conflict({existing, incoming, report, keep_both_name, index: 0, total: 1});
    switch (resolution) {
        case "keep_old":
            return {outcome: "kept_old", name: existing.application_name};
        case "use_new":
            try {
                // the id of the stored one is kept
                await new up_application({...incoming, id: existing.id}).add_remote();
            } catch (err) {
                // add_remote updates the store before the server answers
                store.dispatch(addApplication({[existing.id]: new up_application(existing)}));
                throw err;
            }
            return {outcome: "replaced", name: existing.application_name};
        case "keep_both":
            await new up_application({...incoming, application_name: keep_both_name}).add_remote();
            return {outcome: "kept_both", name: keep_both_name};
    }
}

////////////////////////////////////////////////     PERIPHERALS

export interface peripheral_conflict {
    existing: peripheral;
    incoming: peripheral;
    report: diff_report;
    // the name the imported peripheral gets if both are kept
    keep_both_name: string;
    // position of this conflict among the ones found in the imported file, to tell the user how many are left
    index: number;
    total: number;
}

export interface peripherals_import_summary {
    added: string[];
    replaced: string[];
    kept_both: string[];
    kept_old: string[];
    unchanged: string[];
}

const normalize_peripheral = (periph: peripheral): peripheral => {
    return Object.values(new up_peripheral(periph).get_raw_obj())[0]!;
};

const stored_peripherals = (): peripheral[] => {
    return Object.values(store.getState().peripherals).map(p => normalize_peripheral(p as unknown as peripheral));
};

/// The stored peripheral the imported one would clash with: the name identifies a peripheral for the user (and is
/// unique in the database) so it has precedence over the id
const find_peripheral_conflict = (stored: peripheral[], incoming: peripheral): peripheral | undefined => {
    return stored.find(p => p.name === incoming.name) ?? stored.find(p => p.id === incoming.id);
};

const replace_peripheral = async (existing: peripheral, replacement: peripheral) => {
    await up_peripheral.delete(new up_peripheral(existing));
    try {
        await new up_peripheral(replacement).add_remote();
    } catch (err) {
        // do not lose the peripheral that was there
        try {
            await new up_peripheral(existing).add_remote();
        } catch (restore_err) {
            throw new Error(`"${existing.name}" could not be replaced and its previous version could not be restored, it is no longer stored`);
        }
        throw err;
    }
};

export const parse_peripherals = (raw_json: string): peripheral[] => {
    let imported_periph = JSON.parse(raw_json);
    let [valid, errors] = validate_json(imported_periph, peripheral_schema);
    if(!valid){
        throw errors;
    }
    return imported_periph['peripherals'];
}

/// Imports the peripherals of a file. When one of them clashes (same name or same id) with a stored one that is
/// different, resolve_conflict decides what to do with it, nothing is written before it answers. Importing the same
/// peripheral that is already stored does nothing.
export const import_peripherals = async (
    raw_json: string,
    resolve_conflict: (conflict: peripheral_conflict) => Promise<conflict_resolution>
): Promise<peripherals_import_summary> => {
    const incoming_all = parse_peripherals(raw_json).map(normalize_peripheral);
    const summary: peripherals_import_summary = {added: [], replaced: [], kept_both: [], kept_old: [], unchanged: []};

    let stored = stored_peripherals();
    const total = incoming_all.filter(p => {
        const existing = find_peripheral_conflict(stored, p);
        return existing !== undefined && !diff_is_empty(diff_peripherals(existing, p));
    }).length;
    let index = 0;

    for(const incoming of incoming_all){
        const existing = find_peripheral_conflict(stored, incoming);

        if(existing === undefined){
            await new up_peripheral(incoming).add_remote();
            stored.push(incoming);
            summary.added.push(incoming.name);
            continue;
        }

        const diff = diff_peripherals(existing, incoming);
        if(diff_is_empty(diff)){
            summary.unchanged.push(incoming.name);
            continue;
        }

        const keep_both_name = unique_name(stored.map(p => p.name), incoming.name);
        const resolution = await resolve_conflict({
            existing, incoming, report: peripheral_diff_report(diff), keep_both_name, index: index++, total
        });
        switch (resolution) {
            case "keep_old":
                summary.kept_old.push(existing.name);
                break;
            case "use_new": {
                // the id of the stored one is kept, the applications refer to the peripherals by id
                const replacement = {...incoming, id: existing.id};
                await replace_peripheral(existing, replacement);
                stored = stored.map(p => p.id === existing.id ? normalize_peripheral(replacement) : p);
                summary.replaced.push(existing.name);
                break;
            }
            case "keep_both": {
                const taken_ids = stored.map(p => p.id);
                const id = taken_ids.includes(incoming.id) ? free_id(taken_ids) : incoming.id;
                const copy = {...incoming, id, name: keep_both_name};
                await new up_peripheral(copy).add_remote();
                stored.push(normalize_peripheral(copy));
                summary.kept_both.push(copy.name);
                break;
            }
        }
    }
    return summary;
}
