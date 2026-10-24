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

import {useEffect, useState} from "react";

/// The selection of many items of a list that its owner keeps the single selection of, made with Shift or Ctrl. It is gone
/// when `owner` is another one (the core whose items are listed, say), and `on_multi` tells the panel what is selected, for
/// it not to show the properties of one item then.
export const useListSelection = (owner: unknown, on_multi?: (names: string[]) => void) => {
    const [multi, set_multi] = useState<string[]>([]);

    const set = (names: string[]) => {
        set_multi(names);
        on_multi?.(names);
    };

    useEffect(() => {
        set([]);
    }, [owner]);

    return {
        /// the names selected, only when they are many
        many: multi.length > 1 ? multi : undefined,
        clear: () => {
            if(multi.length > 0) set([]);
        },
        /// the selection changed: one item or none is not a selection of many, the item is selected as usual
        change: (names: string[], select_one: (name: string) => void) => {
            if(names.length > 1){
                set(names);
                return;
            }
            if(multi.length > 0) set([]);
            if(names[0] !== undefined) select_one(names[0]);
        }
    };
};
