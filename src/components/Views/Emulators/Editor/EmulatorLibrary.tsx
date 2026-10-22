/*
 * Copyright(c) 2025. Filippo Savi
 * Author: Filippo Savi <filssavi@gmail.com>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */

import type {ReactNode} from "react";
import {css} from "goober";
import {ColorTheme} from "#UI/index.js";
import {io_colors, io_dashes} from "./io_colors.js";

export type BlockKind = "core" | "source" | "sink";

/// The type of the data carried by the drag of an entry of the library, the canvas takes the drop of it
export const BLOCK_DRAG_TYPE = "application/x-uscope-block";

export interface LibraryEntry {
    id: BlockKind,
    name: string,
    description: string,
    icon: ReactNode,
    group: string,
}

interface EmulatorLibraryProps {
    enabled: boolean,
    onAdd: (kind: BlockKind) => void
}

// the icons are small copies of the nodes of the diagram: a core is a solid box with the pins and the die of a chip, a source is a
// dashed green box that the data leaves, a sink is a dotted orange box that the data enters
const icon_props = {
    width: 36,
    height: 24,
    viewBox: "0 0 36 24",
    fill: "none",
    strokeWidth: 1.75,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true
} as const;

const CoreIcon = () => (
    <svg {...icon_props} stroke="currentColor">
        <rect x="10" y="5" width="16" height="14" rx="2.5"/>
        <rect x="14" y="9" width="8" height="6" rx="1"/>
        <path d="M14 2v3M18 2v3M22 2v3M14 19v3M18 19v3M22 19v3M6 9h4M6 15h4M26 9h4M26 15h4"/>
    </svg>
);

const SourceIcon = () => (
    <svg {...icon_props} stroke={io_colors.source}>
        <rect x="2" y="4" width="16" height="16" rx="2.5" strokeDasharray={io_dashes.source}/>
        <path d="M18 12h14M27 7l5 5-5 5"/>
    </svg>
);

const SinkIcon = () => (
    <svg {...icon_props} stroke={io_colors.sink}>
        <rect x="18" y="4" width="16" height="16" rx="2.5" strokeDasharray={io_dashes.sink}/>
        <path d="M2 12h14M11 7l5 5-5 5"/>
    </svg>
);

const library_class = css`
  display: flex;
  flex-direction: column;
  gap: 0.25em;
  width: 11em;
  flex-shrink: 0;
  padding: 0.5em;
  overflow-y: auto;
  border-right: 1px solid ${ColorTheme.background.borders};
`;

const group_class = css`
  margin: 0.75em 0 0.25em 0.25em;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  opacity: 0.7;
  &:first-child {
    margin-top: 0;
  }
`;

const entry_class = css`
  display: flex;
  align-items: center;
  gap: 0.5em;
  padding: 0.4em 0.5em;
  text-align: left;
  color: ${ColorTheme.text};
  background: ${ColorTheme.background.level_3};
  border: 1px solid ${ColorTheme.background.borders};
  border-radius: 0.5rem;
  cursor: pointer;
  &:hover:not(:disabled) {
    background: ${ColorTheme.background.level_4};
    border-color: ${ColorTheme.background.accents};
  }
  &:disabled {
    opacity: 0.5;
    cursor: default;
  }
`;

const entry_text_class = css`
  display: flex;
  flex-direction: column;
  min-width: 0;
  font-size: 0.8rem;
  small {
    font-size: 0.65rem;
    opacity: 0.7;
  }
`;

let EmulatorLibrary = (props: EmulatorLibraryProps) =>{

    const entries: LibraryEntry[] = [
        {
            id: "core",
            name: "Core",
            description: "Runs a program on the core",
            icon: <CoreIcon/>,
            group: "Compute"
        },
        {
            id: "source",
            name: "Source",
            description: "Feeds data in from the bus",
            icon: <SourceIcon/>,
            group: "External IO"
        },
        {
            id: "sink",
            name: "Sink",
            description: "Writes data out to the bus",
            icon: <SinkIcon/>,
            group: "External IO"
        }
    ];

    const groups = [...new Set(entries.map((e) => e.group))];

    return(
        <div className={library_class} aria-label="Block library">
            {groups.map((group) => (
                <div key={group} style={{display: "contents"}}>
                    <div className={group_class}>{group}</div>
                    {entries.filter((e) => e.group === group).map((entry) => (
                        <button
                            key={entry.id}
                            type="button"
                            className={entry_class}
                            disabled={!props.enabled}
                            draggable={props.enabled}
                            title={"Add " + entry.name + ", click or drag it onto the diagram"}
                            onClick={() => props.onAdd(entry.id)}
                            onDragStart={(event) => {
                                event.dataTransfer.setData(BLOCK_DRAG_TYPE, entry.id);
                                event.dataTransfer.effectAllowed = "copy";
                            }}
                        >
                            {entry.icon}
                            <span className={entry_text_class}>
                                {entry.name}
                                <small>{entry.description}</small>
                            </span>
                        </button>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default EmulatorLibrary;
