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
import {up_application} from "../data_models/up_application.js";
import {up_peripheral} from "../data_models/up_peripheral.js";
import {application_schema} from "./application_schema.js";
import {peripheral_schema} from "./peripheral_schema.js";
import store from "../../store.js";
import {get_next_id} from "../utilities/id_management.js";
import {diff_is_empty, diff_peripherals, type peripheral_diff} from "../data_models/diff_engine/index.js";
import type {peripheral} from "#interfaces/index.js";

let validate_json = (obj: any, schema: object) => {
    const ajv = new Ajv2020.default();
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

export const import_application = (raw_json: any, id: number) => {
    let imported_app = JSON.parse(raw_json);
    imported_app["id"] = id;
    let [valid, errors] = validate_json(imported_app, application_schema);
    if(imported_app.miscellaneous === undefined){
        imported_app.miscellaneous =  {}
    }
    if(valid){
        let app = new up_application(imported_app);
        return app.add_remote().then(()=>{
            return app
        })
    } else{
        return Promise.reject(errors);
    }
}

export type conflict_resolution = "keep_old" | "use_new" | "keep_both";

export interface peripheral_conflict {
    existing: peripheral;
    incoming: peripheral;
    diff: peripheral_diff;
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

/// The name an imported peripheral gets next to the stored one it clashes with: the suffix tells the two apart
const IMPORTED_SUFFIX = "_imported";

const free_name = (stored: peripheral[], name: string): string => {
    if(!stored.some(p => p.name === name)) return name;
    let candidate = name + IMPORTED_SUFFIX;
    for(let n = 2; stored.some(p => p.name === candidate); n++){
        candidate = name + IMPORTED_SUFFIX + "_" + n;
    }
    return candidate;
};

const replace_peripheral = async (existing: peripheral, replacement: peripheral) => {
    await up_peripheral.delete(new up_peripheral(existing));
    try {
        await new up_peripheral(replacement).add_remote();
    } catch (err) {
        // do not lose the peripheral that was there
        await new up_peripheral(existing).add_remote();
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

        const resolution = await resolve_conflict({existing, incoming, diff, keep_both_name: free_name(stored, incoming.name), index: index++, total});
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
                const id = taken_ids.includes(incoming.id) ? get_next_id([...taken_ids].sort((a, b) => a - b)) : incoming.id;
                const copy = {...incoming, id, name: free_name(stored, incoming.name)};
                await new up_peripheral(copy).add_remote();
                stored.push(normalize_peripheral(copy));
                summary.kept_both.push(copy.name);
                break;
            }
        }
    }
    return summary;
}
