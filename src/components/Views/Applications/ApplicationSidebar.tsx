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

import React, {useContext} from 'react';
import {toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import {
    import_application,
    up_application,
} from "#client_core/index.js";
import type {application_conflict, application_import_result} from "#client_core/index.js";
import {SidebarBase} from "#UI/index.js";

import {useAppSelector} from "#redux/hooks.js";
import {error_text} from "#client_core/proxy/errors.js";
import {ApplicationContext} from "#src/AuthApp.jsx";
import {ImportConflictDialog} from "../../Common_Components/ImportConflictDialog.jsx";
import {useConflictResolver} from "../../Common_Components/useConflictResolver.js";


interface ApplicationSidebarProps {
 application: up_application;
  on_select: (id: number) => void;
}

const summarize_import = (r: application_import_result): string => {
    switch (r.outcome) {
        case "added": return `Imported "${r.name}"`;
        case "replaced": return `"${r.name}" replaced by the imported one`;
        case "kept_both": return `Imported as "${r.name}", next to the stored one`;
        case "kept_old": return `"${r.name}" left as stored`;
        case "unchanged": return `"${r.name}" is already up to date`;
    }
};

let  ApplicationSidebar = (props: ApplicationSidebarProps) =>{

    const applications_redux = useAppSelector(state => state.applications);
    // the application the hardware was set up with, which is not the one selected in the editor
    const active_application = useContext(ApplicationContext);
    const conflicts = useConflictResolver<application_conflict>();

    let handleImport = async (app: string) =>{
        conflicts.reset();
        try{
            toast.success(summarize_import(await import_application(app, conflicts.ask)));
        } catch (err){
            const lines = Array.isArray(err) ? err.slice(0, 5).join("\n") : error_text(err);
            toast.error("Import failed:\n" + lines);
        }
    };

    const pending = conflicts.pending;

    return(
        <>
            <SidebarBase
                objects={applications_redux}
                selection_key="id"
                template={up_application}
                display_key="application_name"
                content_name="Applications"
                onImport={handleImport}
                initial_value={props.application}
                onSelect={props.on_select}
            />
            {pending !== null &&
                <ImportConflictDialog
                    item_type="application"
                    existing={{id: pending.existing.id, name: pending.existing.application_name}}
                    incoming={{id: pending.incoming.id, name: pending.incoming.application_name}}
                    report={pending.report}
                    keep_both_name={pending.keep_both_name}
                    index={pending.index}
                    total={pending.total}
                    {...(pending.existing.id === active_application.id ? {
                        warning: "This is the application currently in use. Its setup is only loaded on the hardware when the application is chosen, so the changes do not reach the hardware until it is chosen again."
                    } : {})}
                    onResolve={conflicts.resolve}
                />
            }
        </>
    );

};

export default ApplicationSidebar;
