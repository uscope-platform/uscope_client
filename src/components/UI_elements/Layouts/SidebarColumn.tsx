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

import React from 'react';
import type {CSSProperties, ReactNode} from 'react';
import {css} from 'goober';
import {useContext} from "react";
import {Pane} from "./Pane.js";
import {GroupContext} from "./GroupContext.js";
import {panel_key, useAllFolded} from "../panels/FoldStore.js";
import {UIPanel} from "../panels/UIPanel.js";
import {SimpleContent} from "../panels/SimpleContent.js";

/// A panel of a sidebar
export interface SidebarPanel {
    /// shown in the title bar, and what a PaneGroup keeps the folded state of the panel under
    title: string;
    content: ReactNode;
    /// the content keeps at least this height when the panel is open
    min_height?: string | undefined;
}

// the panels keep their height and the column scrolls when they do not fit, instead of squeezing the ones above
const column_class = css`
    display: flex;
    flex-direction: column;
    gap: 0.5em;
    overflow-y: auto;
    & > * {
        flex-shrink: 0;
    }
`;

// all the panels folded: one under the other, each with its title turned
const folded_class = css`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5em;
    & > * {
        flex-shrink: 0;
        margin: 0 !important;
        padding: 0 !important;
    }
    & [data-title-bar] {
        flex-direction: column;
        height: auto;
        padding: 0.3em 0;
        border-bottom: 0;
    }
    & [data-title] {
        writing-mode: vertical-rl;
        height: auto;
        padding: 0.6em 0;
        border-bottom: 0 !important;
        border-right: 2px solid var(--accents);
    }
`;

interface SidebarColumnProps {
    panels: SidebarPanel[];
    style?: CSSProperties | undefined;
    /// what is in the sidebar besides the panels, like a dialog
    children?: ReactNode;
}

/// The sidebar of a view, a pane of its PaneGroup, made of the panels it is given. When all of them are folded it takes
/// only the room of their titles, turned, so the rest of the view gets the room.
export const SidebarColumn = (props: SidebarColumnProps) => {
    const group_id = useContext(GroupContext) ?? "";
    const all_folded = useAllFolded(props.panels.map((panel) => panel_key(group_id, panel.title)));

    return (
        <Pane id="sidebar" default_size={28} min_size="13em" max_size={60} fit={all_folded}>
            <div className={all_folded ? folded_class : column_class} style={props.style}>
                {props.panels.map((panel) => (
                    <UIPanel key={panel.title} level="level_2">
                        <SimpleContent name={panel.title} min_height={panel.min_height}>
                            {panel.content}
                        </SimpleContent>
                    </UIPanel>
                ))}
            </div>
            {props.children}
        </Pane>
    );
};
