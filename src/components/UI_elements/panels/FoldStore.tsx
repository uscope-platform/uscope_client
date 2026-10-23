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

import React, {createContext, useContext, useState} from 'react';
import type {ReactNode} from 'react';
import {guarded_storage} from "../Layouts/guarded_storage.js";

const STORAGE_KEY = "uscope_folds";

interface FoldStore {
    /// by key: true for the panels that are folded
    folded: Record<string, boolean>;
    toggle: (key: string) => void;
}

const FoldStoreContext = createContext<FoldStore | null>(null);

const read_folds = (): Record<string, boolean> => {
    try {
        return JSON.parse(guarded_storage.getItem(STORAGE_KEY) ?? "{}");
    } catch {
        return {};
    }
};

/// Keeps which panels of the app are folded, in localStorage. Without it nothing can be folded.
export const FoldProvider = (props: {children: ReactNode}) => {
    const [folded, set_folded] = useState(read_folds);

    // from the state at the moment of the update, so that two panels folded in the same event both stay
    const toggle = (key: string) => {
        set_folded((current) => {
            const next = {...current, [key]: !current[key]};
            guarded_storage.setItem(STORAGE_KEY, JSON.stringify(next));
            return next;
        });
    };

    return <FoldStoreContext value={{folded, toggle}}>{props.children}</FoldStoreContext>;
};

export interface FoldControl {
    collapsed: boolean;
    toggle: () => void;
}

/// The fold of whatever is kept under the key, null when it cannot be folded
export const useFold = (key: string | undefined): FoldControl | null => {
    const store = useContext(FoldStoreContext);
    if(store === null || key === undefined) return null;
    return {collapsed: store.folded[key] === true, toggle: () => store.toggle(key)};
};

/// Whether all the panels under these keys are folded
export const useAllFolded = (keys: string[]): boolean => {
    const store = useContext(FoldStoreContext);
    return store !== null && keys.length > 0 && keys.every((key) => store.folded[key] === true);
};

/// Whether the panel under the key is folded, for the ones that ask about several
export const useIsFolded = (): ((key: string) => boolean) => {
    const store = useContext(FoldStoreContext);
    return (key) => store !== null && store.folded[key] === true;
};

interface FoldScopeValue {
    /// tells the panels of a group from the ones of the others that have the same title
    scope: string;
    /// set inside a pane that is folded as a whole
    pane: FoldControl | null;
}

const FoldScopeContext = createContext<FoldScopeValue>({scope: "", pane: null});

/// What the panels below need to be told by the pane that holds them
export const FoldScope = (props: FoldScopeValue & {children: ReactNode}) => (
    <FoldScopeContext value={{scope: props.scope, pane: props.pane}}>{props.children}</FoldScopeContext>
);

export const panel_key = (scope: string, title: string) => scope + ":" + title;

/// What the title bar of a panel needs to fold it: the pane around it when that is what folds, else the panel itself,
/// by its title. null where nothing can fold it.
export const usePanelFold = (title: string | undefined): FoldControl | null => {
    const {scope, pane} = useContext(FoldScopeContext);
    const own = useFold(title === undefined ? undefined : panel_key(scope, title));
    return pane ?? own;
};

/// The scope of the panels below, for what asks about their keys from outside
export const useFoldScope = () => useContext(FoldScopeContext).scope;
