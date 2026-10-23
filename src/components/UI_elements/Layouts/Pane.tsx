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

import React, {useContext, useId} from 'react';
import type {HTMLAttributes, ReactNode} from 'react';
import {css} from 'goober';
import {Panel} from 'react-resizable-panels';
import {GroupContext} from "./GroupContext.js";
import {FoldScope, useFold} from "../panels/FoldStore.js";

export interface PaneProps {
    /// has to be different for every pane of the group, and stays the same for the sizes to be remembered
    id?: string | undefined;
    /// the size, when the user did not choose one: a number is a percentage, "20em" or "300px" a fixed size
    default_size?: number | string | undefined;
    min_size?: number | string | undefined;
    max_size?: number | string | undefined;
    /// the title of the pane has an arrow that folds it, so that it takes only the room of its title
    collapsible?: boolean | undefined;
}

/// What the fold of a pane is kept under
export const pane_key = (group_id: string, pane_id: string) => group_id + ":pane:" + pane_id;

// the double click on a handle passes the default size to resize(), that reads a bare number as pixels, so percentages get their unit
const as_size = (size: number | string | undefined) => typeof size === "number" ? size + "%" : size;

// the pane is a column so that its content can fill it
const pane_class = css`
    display: flex;
    flex-direction: column;
    min-width: 0;
    min-height: 0;
`;

interface PaneComponentProps extends PaneProps, HTMLAttributes<HTMLDivElement> {
    /// takes only the room of its content: for a pane that is folded, or that has nothing but folded panels
    fit?: boolean | undefined;
}

/// A pane of a PaneGroup, for the content that is not a UIPanel or a PaneGroup, that are panes by themselves
export const Pane = (props: PaneComponentProps) => {
    const {id, default_size, min_size, max_size, collapsible, fit, className, children, ...rest} = props;
    const group_id = useContext(GroupContext) ?? "";
    const auto_id = useId();
    const pane_id = id ?? auto_id;
    const fold = useFold(collapsible ? pane_key(group_id, pane_id) : undefined);

    return (
        <Panel
            id={pane_id}
            className={className ?? pane_class}
            defaultSize={as_size(default_size)}
            minSize={as_size(min_size)}
            maxSize={as_size(max_size)}
            // the group sets the size inline: a folded pane has to override it to take only its title
            data-fit={fold?.collapsed || fit ? "" : undefined}
            {...rest}
        >
            <GroupContext value={null}>
                <FoldScope scope={group_id} pane={fold}>
                    {children}
                </FoldScope>
            </GroupContext>
        </Panel>
    );
};

/// The sizes the views give to the area they show
export const MainPane = (props: {children: ReactNode}) => (
    <Pane id="main" default_size={72} min_size={30}>{props.children}</Pane>
);

export const SidebarPane = (props: {children: ReactNode}) => (
    <Pane id="sidebar" default_size={28} min_size="13em" max_size={60}>{props.children}</Pane>
);
