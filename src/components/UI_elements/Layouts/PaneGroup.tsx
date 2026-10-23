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

import React, {Children, isValidElement} from 'react';
import type {CSSProperties, ReactNode} from 'react';
import {css} from 'goober';
import {Group, useDefaultLayout} from 'react-resizable-panels';
import {guarded_storage} from "./guarded_storage.js";
import {GroupContext, useIsPane} from "./GroupContext.js";
import {Pane, pane_key} from "./Pane.js";
import type {PaneProps} from "./Pane.js";
import {PaneHandle} from "./PaneHandle.js";
import {useIsFolded} from "../panels/FoldStore.js";

// the pane that takes only its content is set by the pane itself, over the size the library gives it
const group_class = css`
    & > [data-panel][data-fit] {
        flex: 0 0 auto !important;
    }
`;

interface PaneGroupProps extends PaneProps {
    /// names the group in the storage, so it has to be different for every group of the app
    id: string;
    /// "horizontal" puts the panes side by side, "vertical" one over the other
    orientation: "horizontal" | "vertical";
    style?: CSSProperties | undefined;
    children: ReactNode;
}

/// Resizable panes, with a handle between each of them: the UIPanels (or Pane) inside are the panes.
/// Inside another PaneGroup it is a pane of it, that the size props apply to.
export const PaneGroup = (props: PaneGroupProps) => {
    const nested = useIsPane();
    const is_folded = useIsFolded();
    const {defaultLayout, onLayoutChanged} = useDefaultLayout({
        id: "uscope_split_" + props.id,
        storage: guarded_storage,
        onlySaveAfterUserInteractions: true
    });

    const panes = Children.toArray(props.children);
    // as a pane of its parent it takes only its titles when all its panes are folded
    const all_folded = panes.length > 0 && panes.every((pane) => {
        const id = isValidElement<PaneProps>(pane) ? pane.props.id : undefined;
        return id !== undefined && is_folded(pane_key(props.id, id));
    });

    const group = (
        <Group
            id={props.id}
            className={group_class}
            orientation={props.orientation}
            defaultLayout={defaultLayout}
            onLayoutChanged={onLayoutChanged}
            style={{height: "100%", width: "100%", ...props.style}}
        >
            <GroupContext value={props.id}>
                {panes.flatMap((pane, idx) => idx === 0 ? [pane] : [<PaneHandle key={"handle_" + idx}/>, pane])}
            </GroupContext>
        </Group>
    );

    if(nested){
        return <Pane id={props.id} default_size={props.default_size} min_size={props.min_size} max_size={props.max_size} fit={all_folded}>{group}</Pane>;
    }
    return group;
};
