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

import React, {useRef, useState} from 'react';
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import {
    import_peripherals,
    up_peripheral,
} from "#client_core/index.js";
import type {conflict_resolution, peripheral_conflict, peripherals_import_summary} from "#client_core/index.js";

import {SidebarBase} from "#UI/index.js";
import {useAppSelector} from "#redux/hooks.js";
import {ImportConflictDialog} from "./ImportConflictDialog.jsx";

interface PeripheralsSidebarProps {
    on_select: (id: number) => void;
}

interface PendingConflict {
    conflict: peripheral_conflict;
    resolve: (resolution: conflict_resolution) => void;
}

const summarize_import = (s: peripherals_import_summary): string => {
    const parts = [
        s.added.length > 0 ? `${s.added.length} added` : null,
        s.replaced.length > 0 ? `${s.replaced.length} replaced` : null,
        s.kept_both.length > 0 ? `${s.kept_both.length} kept alongside the stored one` : null,
        s.kept_old.length > 0 ? `${s.kept_old.length} left as stored` : null,
        s.unchanged.length > 0 ? `${s.unchanged.length} already up to date` : null,
    ].filter(p => p !== null);
    return parts.length > 0 ? "Import done: " + parts.join(", ") : "Nothing to import";
};

// the format the import reads: what the peripheral stores, no more, in a list of peripherals
const export_peripheral = (periph: up_peripheral) => {
    return {peripherals: Object.values(new up_peripheral(periph).get_raw_obj())};
};

let  PeripheralsSidebar = (props: PeripheralsSidebarProps) =>{

    const peripherals_redux = useAppSelector(state => state.peripherals);
    const [pending, set_pending] = useState<PendingConflict | null>(null);
    // the choice made for "do the same for the others", valid until the end of the file
    const remembered = useRef<conflict_resolution | null>(null);

    let ask_user = (conflict: peripheral_conflict) => {
        if(remembered.current !== null) return Promise.resolve(remembered.current);
        return new Promise<conflict_resolution>((resolve) => {
            set_pending({conflict, resolve});
        });
    };

    let handle_resolution = (resolution: conflict_resolution, apply_to_all: boolean) => {
        if(apply_to_all) remembered.current = resolution;
        pending?.resolve(resolution);
        set_pending(null);
    };

    let handleImport = async (content: string) =>{
        remembered.current = null;
        try{
            const summary = await import_peripherals(content, ask_user);
            toast.success(summarize_import(summary));
        } catch (err){
            const lines = Array.isArray(err) ? err.slice(0, 5).join("\n") : String(err);
            toast.error("Import failed:\n" + lines);
        }
    };


    return(
        <>
            <SidebarBase
                objects={peripherals_redux}
                selection_key="id"
                template={up_peripheral}
                display_key="name"
                content_name="Peripherals"
                onImport={handleImport}
                export_format={export_peripheral}
                onSelect={props.on_select}
            />
            {pending !== null &&
                <ImportConflictDialog conflict={pending.conflict} onResolve={handle_resolution}/>
            }
            <ToastContainer theme="dark" position="bottom-right" style={{whiteSpace: "pre-line"}}/>
        </>
    );
};

export default PeripheralsSidebar;
