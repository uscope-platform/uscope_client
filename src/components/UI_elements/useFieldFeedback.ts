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

import React, {useEffect, useRef, useState} from "react";

/// idle: nothing to apply, dirty: typed and not applied yet, saving: the handler is running,
/// applied: the handler succeeded (shown for a moment), error: the handler failed
export type field_status = "idle" | "dirty" | "saving" | "applied" | "error";

const APPLIED_SHOWN_MS = 1500;

/// The feedback of a field that applies its edit when Enter or Tab is pressed, which is how all the fields of the
/// interface work: the handler gets the key event and, when it is async, the field follows it. `applied_value` is
/// the value the field holds as applied (its defaultValue), the field is dirty when the text differs from it.
export const useFieldFeedback = (
    applied_value: string | number | undefined,
    on_key_down: ((event: React.KeyboardEvent<HTMLInputElement>) => void | Promise<unknown>) | undefined,
    enabled: boolean
) => {
    const [status, set_status] = useState<field_status>("idle");
    const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
    const mounted = useRef(true);

    useEffect(() => {
        mounted.current = true;
        return () => {
            mounted.current = false;
            clearTimeout(timer.current);
        };
    }, []);

    // the field now holds another value (another item was selected): what was pending for the old one is gone
    useEffect(() => {
        set_status((current) => current === "dirty" || current === "error" ? "idle" : current);
    }, [applied_value]);

    const show_applied = () => {
        if(!mounted.current) return;
        set_status("applied");
        clearTimeout(timer.current);
        timer.current = setTimeout(() => {
            set_status((current) => current === "applied" ? "idle" : current);
        }, APPLIED_SHOWN_MS);
    };

    const differs = (text: string) => text !== String(applied_value ?? "");

    const on_input = (event: React.FormEvent<HTMLInputElement>) => {
        if(!enabled) return;
        clearTimeout(timer.current);
        const dirty = differs(event.currentTarget.value);
        set_status((current) => current === "saving" ? current : (dirty ? "dirty" : "idle"));
    };

    const key_down = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if(!on_key_down) return;
        const commits = enabled && (event.key === "Enter" || event.key === "Tab") && differs(event.currentTarget.value);
        const result = on_key_down(event);
        if(!commits) return;
        if(result !== undefined && typeof (result as Promise<unknown>).then === "function"){
            set_status("saving");
            (result as Promise<unknown>).then(show_applied, (error) => {
                if(mounted.current) set_status("error");
                // not handled here: it still has to reach the unhandled rejection reporting
                throw error;
            });
        } else {
            show_applied();
        }
    };

    return {
        status,
        on_input,
        key_down: on_key_down ? key_down : undefined,
        title: status === "dirty" ? "Press Enter to apply" : status === "error" ? "The change was not applied" : undefined,
    };
};
