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

import {useSyncExternalStore} from "react";
import {guarded_storage} from "./Layouts/guarded_storage.js";

const STORAGE_KEY = "uscope_developer_mode";

const listeners = new Set<() => void>();

/// Whether the debugging tools (like the raw scope buffer dump) are shown. Off until the user turns it on.
export const developer_mode_enabled = (): boolean => guarded_storage.getItem(STORAGE_KEY) === "true";

export const set_developer_mode = (enabled: boolean) => {
    guarded_storage.setItem(STORAGE_KEY, String(enabled));
    listeners.forEach((listener) => listener());
};

const subscribe = (listener: () => void) => {
    listeners.add(listener);
    return () => {
        listeners.delete(listener);
    };
};

export const useDeveloperMode = (): boolean => useSyncExternalStore(subscribe, developer_mode_enabled);
