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

import React, {Children, createContext, useContext} from 'react';
import type {CSSProperties, HTMLAttributes, ReactNode} from 'react';
import {css} from 'goober';
import {Group, Panel, Separator, useDefaultLayout} from 'react-resizable-panels';
import type {LayoutStorage} from 'react-resizable-panels';
import {ColorTheme} from "../ColorTheme.js";

/// The sizes are kept in localStorage, that can be missing or full: the splitters then just start from the default sizes
const guarded_storage: LayoutStorage = {
    getItem: (key) => {
        try {
            return localStorage.getItem(key);
        } catch {
            return null;
        }
    },
    setItem: (key, value) => {
        try {
            localStorage.setItem(key, value);
        } catch {
            // the size is not remembered, nothing else is lost
        }
    }
};

// true for what is rendered directly in a group: that is a pane of it, and what is inside a pane is not
const SplitContext = createContext(false);

/// Whether the component is directly inside a SplitGroup, so that it is one of its resizable panes
export const use_split_pane = () => useContext(SplitContext);

export interface PaneProps {
    /// has to be different for every pane of the group, and stays the same for the sizes to be remembered
    id?: string | undefined;
    /// the size, when the user did not choose one: a number is a percentage, "20em" or "300px" a fixed size
    default_size?: number | string | undefined;
    min_size?: number | string | undefined;
    max_size?: number | string | undefined;
}

// the double click on a handle passes the default size to resize(), that reads a bare number as pixels, so percentages get their unit
const as_size = (size: number | string | undefined) => typeof size === "number" ? size + "%" : size;

// the pane is a column so that its content can fill it
const pane_class = css`
    display: flex;
    flex-direction: column;
    min-width: 0;
    min-height: 0;
`;

/// A pane of a SplitGroup, for the content that is not a UIPanel or a SplitGroup, that are panes by themselves
export const Pane = (props: PaneProps & HTMLAttributes<HTMLDivElement>) => {
    const {id, default_size, min_size, max_size, className, children, ...rest} = props;
    return (
        <Panel
            id={id}
            className={className ?? pane_class}
            defaultSize={as_size(default_size)}
            minSize={as_size(min_size)}
            maxSize={as_size(max_size)}
            {...rest}
        >
            <SplitContext value={false}>
                {children}
            </SplitContext>
        </Panel>
    );
};

interface SplitGroupProps extends PaneProps {
    /// names the group in the storage, so it has to be different for every group of the app
    id: string;
    /// "horizontal" puts the panes side by side, "vertical" one over the other
    orientation: "horizontal" | "vertical";
    style?: CSSProperties | undefined;
    children: ReactNode;
}

/// Resizable panes, with a handle between each of them: the UIPanels (or Pane) inside are the panes.
/// Inside another SplitGroup it is a pane of it, that the size props apply to.
export const SplitGroup = (props: SplitGroupProps) => {
    const nested = use_split_pane();
    const {defaultLayout, onLayoutChanged} = useDefaultLayout({
        id: "uscope_split_" + props.id,
        storage: guarded_storage,
        onlySaveAfterUserInteractions: true
    });

    const panes = Children.toArray(props.children);
    const group = (
        <Group
            id={props.id}
            orientation={props.orientation}
            defaultLayout={defaultLayout}
            onLayoutChanged={onLayoutChanged}
            style={{height: "100%", width: "100%", ...props.style}}
        >
            <SplitContext value={true}>
                {panes.flatMap((pane, idx) => idx === 0 ? [pane] : [<SplitHandle key={"handle_" + idx}/>, pane])}
            </SplitContext>
        </Group>
    );

    if(nested){
        return <Pane id={props.id} default_size={props.default_size} min_size={props.min_size} max_size={props.max_size}>{group}</Pane>;
    }
    return group;
};

// the gap between the panes is the handle: the line shows up on hover, focus and drag
const handle_class = css`
    position: relative;
    outline: none;
    &::after {
        content: "";
        position: absolute;
        border-radius: 2px;
        background: transparent;
        transition: background 0.15s;
    }
    &[aria-orientation="vertical"] {
        width: 10px;
        cursor: col-resize;
    }
    &[aria-orientation="horizontal"] {
        height: 10px;
        cursor: row-resize;
    }
    &[aria-orientation="vertical"]::after {
        top: 0;
        bottom: 0;
        left: 3px;
        width: 4px;
    }
    &[aria-orientation="horizontal"]::after {
        left: 0;
        right: 0;
        top: 3px;
        height: 4px;
    }
    &[data-separator="hover"]::after,
    &[data-separator="focus"]::after {
        background: ${ColorTheme.background.bordersLight};
    }
    &[data-separator="active"]::after {
        background: ${ColorTheme.background.accents};
    }
`;

/// Dragging it, or the arrow keys when it has the focus, resizes the neighbours; double click gives back the default sizes
const SplitHandle = () => <Separator className={handle_class}/>;
