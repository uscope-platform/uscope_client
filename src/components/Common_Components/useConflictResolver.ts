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

import {useRef, useState} from "react";
import type {conflict_resolution} from "#client_core/index.js";

interface PendingConflict<C> {
    conflict: C;
    resolve: (resolution: conflict_resolution) => void;
}

/// The bridge between an import, which asks what to do with every conflict it finds, and the dialog that asks the user.
/// `ask` is given to the import, `pending` is the conflict the dialog has to show (null when there is none) and
/// `resolve` is called with the answer of the user. `reset` has to be called before every import: the answer chosen for
/// "the other conflicts" only lasts until the end of the file
export const useConflictResolver = <C,>() => {
    const [pending, set_pending] = useState<PendingConflict<C> | null>(null);
    const remembered = useRef<conflict_resolution | null>(null);

    const ask = (conflict: C): Promise<conflict_resolution> => {
        if (remembered.current !== null) return Promise.resolve(remembered.current);
        return new Promise<conflict_resolution>((resolve) => {
            set_pending({conflict, resolve});
        });
    };

    const resolve = (resolution: conflict_resolution, apply_to_all: boolean) => {
        if (apply_to_all) remembered.current = resolution;
        pending?.resolve(resolution);
        set_pending(null);
    };

    const reset = () => {
        remembered.current = null;
    };

    return {pending: pending?.conflict ?? null, ask, resolve, reset};
};
