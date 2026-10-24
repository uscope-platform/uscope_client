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

import React, {useEffect, useRef, useState} from 'react';
import type {HTMLAttributes, ReactNode} from 'react';
import {css} from 'goober';
import {MdKeyboardArrowDown} from "react-icons/md";
import {ColorTheme} from "../ColorTheme.js";
import {usePanelFold} from "./FoldStore.js";

/// What a panel keeps when it is folded to its title
export const TITLE_BAR_HEIGHT = 38;

const bar_class = css`
    display: flex;
    align-items: center;
    flex-shrink: 0;
    box-sizing: border-box;
    height: ${TITLE_BAR_HEIGHT}px;
    padding: 0 0.3em;
    background: ${ColorTheme.background.level_4};
    border-bottom: 1px solid ${ColorTheme.background.borders};
    /* what follows the bar in the panel is not shown while it is folded, and stays mounted */
    &[data-folded] ~ * {
        display: none;
    }
`;

const arrow_class = css`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 1.9em;
    height: 1.9em;
    margin-right: 0.1em;
    padding: 0;
    border: 0;
    border-radius: 4px;
    background: transparent;
    color: ${ColorTheme.icons_color};
    cursor: pointer;
    & svg {
        transition: transform 0.15s;
    }
    &[aria-expanded="false"] svg {
        transform: rotate(-90deg);
    }
    &:hover {
        background: ${ColorTheme.background.level_5};
    }
    &:focus-visible {
        outline: 2px solid ${ColorTheme.background.accents};
    }
`;

interface TitleBarProps {
    /// names the panel for the PaneGroup that folds it, so it has to be different for every panel of the group;
    /// without it, or outside of a PaneGroup, there is no arrow and the panel cannot be folded
    name?: string | undefined;
    children: ReactNode;
}

/// The row of titles of a panel, with the arrow that folds it. A double click on the bar folds it too.
export const TitleBar = (props: TitleBarProps) => {
    const control = usePanelFold(props.name);
    return (
        <div
            className={bar_class}
            onDoubleClick={control?.toggle}
            data-title-bar=""
            data-folded={control?.collapsed ? "" : undefined}
        >
            {control && (
                <button
                    type="button"
                    className={arrow_class}
                    aria-label={control.collapsed ? "Expand" : "Collapse"}
                    aria-expanded={!control.collapsed}
                    onClick={control.toggle}
                    onDoubleClick={(e) => e.stopPropagation()}
                >
                    <MdKeyboardArrowDown size="1.4em"/>
                </button>
            )}
            {props.children}
        </div>
    );
};

const title_class = (selected: boolean, clickable: boolean) => css`
    display: flex;
    align-items: center;
    flex-shrink: 0;
    box-sizing: border-box;
    height: 100%;
    padding: 0 0.8em;
    font-size: 0.92rem;
    font-weight: 600;
    white-space: nowrap;
    cursor: ${clickable ? "pointer" : "default"};
    opacity: ${selected ? 1 : 0.65};
    border-bottom: 2px solid ${selected ? ColorTheme.background.accents : "transparent"};
    ${clickable ? `
    border-radius: 6px 6px 0 0;
    transition: background 0.15s, opacity 0.15s;
    background: ${selected ? ColorTheme.background.transparent_accents : "transparent"};
    &:hover {
        background: ${selected ? ColorTheme.background.transparent_accents : ColorTheme.background.level_5};
    }` : ""}
    &:hover {
        opacity: 1;
    }
`;

interface PanelTitleProps extends HTMLAttributes<HTMLDivElement> {
    selected: boolean;
}

/// A title of a panel, or a tab when it has an onClick; the selected one has the accent underline
export const PanelTitle = ({selected, ...rest}: PanelTitleProps) => (
    <div
        className={title_class(selected, rest.onClick !== undefined)}
        data-title=""
        data-selected={selected ? "" : undefined}
        {...(rest.onClick !== undefined ? {role: "tab", "aria-selected": selected} : {})}
        {...rest}
    />
);

const strip_class = css`
    position: relative;
    display: flex;
    align-items: stretch;
    flex: 1 1 auto;
    min-width: 0;
    height: 100%;
    overflow-x: auto;
    overflow-y: hidden;
    scrollbar-width: none;
    &::-webkit-scrollbar {
        display: none;
    }
`;

// the width of the fade that tells there are tabs past the edge
const FADE = "1.6em";

/// The tabs of a title bar, in a row that scrolls when they do not fit: without a scrollbar, with a fade at the edge
/// that has more tabs behind it, the wheel scrolling it sideways, and the selected tab brought into view.
export const TabStrip = (props: {children: ReactNode}) => {
    const strip = useRef<HTMLDivElement>(null);
    const [more, set_more] = useState({before: false, after: false});

    const measure = () => {
        const el = strip.current;
        if(!el) return;
        const before = el.scrollLeft > 1;
        const after = el.scrollLeft + el.clientWidth < el.scrollWidth - 1;
        set_more((current) => current.before === before && current.after === after ? current : {before, after});
    };

    useEffect(() => {
        const el = strip.current;
        if(!el) return;
        measure();
        const observer = new ResizeObserver(measure);
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    // the tab that was selected is brought into view, from the side it is out of
    useEffect(() => {
        const el = strip.current;
        const tab = el?.querySelector<HTMLElement>("[data-selected]");
        if(!el || !tab) return;
        const margin = 24;
        if(tab.offsetLeft - margin < el.scrollLeft) el.scrollLeft = Math.max(0, tab.offsetLeft - margin);
        else if(tab.offsetLeft + tab.offsetWidth + margin > el.scrollLeft + el.clientWidth) el.scrollLeft = tab.offsetLeft + tab.offsetWidth + margin - el.clientWidth;
        measure();
    });

    const on_wheel = (event: React.WheelEvent<HTMLDivElement>) => {
        const el = strip.current;
        // a mouse wheel scrolls up and down: here it is the way along the tabs
        if(el && Math.abs(event.deltaY) > Math.abs(event.deltaX)) el.scrollLeft += event.deltaY;
    };

    const mask = `linear-gradient(to right, ${more.before ? "transparent" : "black"}, black ${more.before ? FADE : "0"}, black calc(100% - ${more.after ? FADE : "0px"}), ${more.after ? "transparent" : "black"})`;

    return (
        <div
            ref={strip}
            className={strip_class}
            role="tablist"
            onScroll={measure}
            onWheel={on_wheel}
            style={{maskImage: mask, WebkitMaskImage: mask}}
        >
            {props.children}
        </div>
    );
};
