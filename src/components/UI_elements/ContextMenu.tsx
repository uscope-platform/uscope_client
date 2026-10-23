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

import React, {useEffect, useState} from "react";
import {MdMoreVert} from "react-icons/md";
import {createPortal} from "react-dom";
import {styled} from "goober";
import {ColorTheme} from "./ColorTheme.js";

export interface ContextMenuAction {
    label: string;
    onSelect: () => void;
    danger?: boolean;
}

const Menu = styled('div')`
  position: fixed;
  z-index: 1000;
  min-width: 9em;
  padding: 0.25em;
  border-radius: 6px;
  border: 1px solid ${ColorTheme.background.bordersLight};
  background: ${ColorTheme.background.select_background};
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.4);
`

const Entry = styled('div')`
  padding: 0.35em 0.7em;
  border-radius: 4px;
  cursor: pointer;
  color: ${ColorTheme.text};
  &[data-danger] {
    color: ${ColorTheme.field.error};
  }
  &:hover {
    background: ${ColorTheme.background.level_5};
  }
`

interface ContextMenuProps {
    /// where the menu opens, in the coordinates of the viewport
    x: number;
    y: number;
    actions: ContextMenuAction[];
    onClose: () => void;
}

/// A small menu of actions, opened on a point of the screen. It closes when anything else is clicked, on Escape and when the page scrolls.
export const ContextMenu = (props: ContextMenuProps) => {
    const {onClose} = props;

    useEffect(() => {
        const close = () => onClose();
        const close_on_escape = (event: KeyboardEvent) => {
            if(event.key === "Escape") onClose();
        };
        window.addEventListener("pointerdown", close);
        window.addEventListener("scroll", close, true);
        window.addEventListener("resize", close);
        window.addEventListener("keydown", close_on_escape);
        return () => {
            window.removeEventListener("pointerdown", close);
            window.removeEventListener("scroll", close, true);
            window.removeEventListener("resize", close);
            window.removeEventListener("keydown", close_on_escape);
        };
    }, [onClose]);

    // the menu is inside the window even when opened near its edge
    const left = Math.min(props.x, window.innerWidth - 160);
    const top = Math.min(props.y, window.innerHeight - (props.actions.length * 32 + 16));

    return createPortal(
        // a click on the menu must not reach the listener that closes it before the action runs
        <Menu style={{left, top}} onPointerDown={(event) => event.stopPropagation()} onContextMenu={(event) => {event.preventDefault(); event.stopPropagation();}}>
            {props.actions.map((action) => (
                <Entry key={action.label} data-danger={action.danger ? "" : undefined} onClick={() => {
                    onClose();
                    action.onSelect();
                }}>
                    {action.label}
                </Entry>
            ))}
        </Menu>,
        document.body
    );
};

// on a screen without hover, so without a way to right click, the menu opens from a button
const MenuButton = styled('div')`
  display: none;
  flex-shrink: 0;
  padding: 0.2em;
  @media (hover: none) {
    display: flex;
  }
`

/// What an element needs to have a menu of actions: the handler of its right click, the button that opens the menu on
/// the screens without hover, and the menu itself. They are all null when there are no actions.
export const useContextMenu = (actions: ContextMenuAction[]) => {
    const [at, set_at] = useState<{x: number, y: number} | null>(null);

    if(actions.length === 0){
        return {on_context_menu: undefined, button: null, menu: null, open: false};
    }

    const on_context_menu = (event: React.MouseEvent) => {
        event.preventDefault();
        set_at({x: event.clientX, y: event.clientY});
    };

    const button = (
        <MenuButton aria-label="Actions" onClick={(event) => {
            const rect = event.currentTarget.getBoundingClientRect();
            set_at({x: rect.left, y: rect.bottom});
        }}>
            <MdMoreVert size={ColorTheme.icons_size} color={ColorTheme.icons_color}/>
        </MenuButton>
    );

    const menu = at ? <ContextMenu x={at.x} y={at.y} actions={actions} onClose={() => set_at(null)}/> : null;

    return {on_context_menu, button, menu, open: at !== null};
};
