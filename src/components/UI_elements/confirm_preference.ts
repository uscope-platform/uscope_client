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

import {useSyncExternalStore} from "react";
import {guarded_storage} from "./Layouts/guarded_storage.js";

const STORAGE_KEY = "uscope_confirm_delete";

const listeners = new Set<() => void>();

/// Whether deleting something asks for a confirmation first. It does, until the user chose not to be asked anymore.
export const confirm_delete_enabled = (): boolean => guarded_storage.getItem(STORAGE_KEY) !== "false";

export const set_confirm_delete = (enabled: boolean) => {
    guarded_storage.setItem(STORAGE_KEY, String(enabled));
    listeners.forEach((listener) => listener());
};

const subscribe = (listener: () => void) => {
    listeners.add(listener);
    return () => {
        listeners.delete(listener);
    };
};

/// The preference as state, so that the settings and the dialogs agree
export const useConfirmDelete = (): boolean => useSyncExternalStore(subscribe, confirm_delete_enabled);
