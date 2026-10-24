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

import {useRef} from "react";

/// The object that a view edits, built from what the store has. The edits are made on the object and then sent to the
/// store, which holds a copy of it: the same object is kept while the store only has what it was given, so that what
/// refers to its parts (a selected item) is still valid, and it is built again when the store has changed otherwise,
/// from another place.
export const useStoredInstance = <S, I extends object>(stored: S | undefined, build: (stored: S) => I, empty: () => I): I => {
    const kept = useRef<{instance: I, text: string} | null>(null);

    if(stored === undefined){
        kept.current = null;
        return empty();
    }

    const fresh = build(stored);
    const fresh_text = JSON.stringify(fresh);
    if(kept.current === null){
        kept.current = {instance: fresh, text: fresh_text};
    } else if(kept.current.text !== fresh_text){
        // the store changed: it is only the edits that were made on the instance when it has them all
        if(JSON.stringify(kept.current.instance) === fresh_text) kept.current.text = fresh_text;
        else kept.current = {instance: fresh, text: fresh_text};
    }
    return kept.current.instance;
};
