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

import React, {useState} from 'react';
import {toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import {
    import_peripherals,
    up_peripheral,
} from "#client_core/index.js";
import type {peripheral_conflict, peripherals_import_summary} from "#client_core/index.js";

import {PromptDialog, SidebarBase, SidebarColumn} from "#UI/index.js";
import {useAppSelector} from "#redux/hooks.js";
import {error_text} from "#client_core/proxy/errors.js";
import {ImportConflictDialog} from "../../Common_Components/ImportConflictDialog.jsx";
import {useConflictResolver} from "../../Common_Components/useConflictResolver.js";

interface PeripheralsSidebarProps {
    on_select: (id: number) => void;
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
    const conflicts = useConflictResolver<peripheral_conflict>();
    // the peripheral whose version is being edited
    const [editing_version, set_editing_version] = useState<{id: number, version: string} | null>(null);

    let handleImport = async (content: string) =>{
        conflicts.reset();
        try{
            const summary = await import_peripherals(content, conflicts.ask);
            toast.success(summarize_import(summary));
        } catch (err){
            const lines = Array.isArray(err) ? err.slice(0, 5).join("\n") : error_text(err);
            toast.error("Import failed:\n" + lines);
        }
    };


    return(
        <SidebarColumn panels={[{title: "Peripherals List", content: (
            <SidebarBase
                objects={peripherals_redux}
                selection_key="id"
                template={up_peripheral}
                display_key="name"
                content_name="Peripherals"
                description_key="version"
                extra_item_actions={(item) => [{label: "Edit version", onSelect: () => set_editing_version({id: item.id, version: String(item.version)})}]}
                onImport={handleImport}
                export_format={export_peripheral}
                onSelect={props.on_select}
            />
        )}]}>
            {editing_version !== null &&
                <PromptDialog
                    title="Edit version"
                    initial_value={editing_version.version}
                    confirm_label="Save"
                    validate={(value) => Number.isNaN(parseFloat(value)) ? "The version has to be a number." : null}
                    onCancel={() => set_editing_version(null)}
                    onConfirm={(version) => {
                        const periph = peripherals_redux[editing_version.id];
                        set_editing_version(null);
                        if(periph) new up_peripheral(periph).set_version(version).catch((err) => toast.error(error_text(err)));
                    }}
                />
            }
            {conflicts.pending !== null &&
                <ImportConflictDialog
                    item_type="peripheral"
                    existing={conflicts.pending.existing}
                    incoming={conflicts.pending.incoming}
                    report={conflicts.pending.report}
                    keep_both_name={conflicts.pending.keep_both_name}
                    index={conflicts.pending.index}
                    total={conflicts.pending.total}
                    onResolve={conflicts.resolve}
                />
            }
        </SidebarColumn>
    );
};

export default PeripheralsSidebar;
