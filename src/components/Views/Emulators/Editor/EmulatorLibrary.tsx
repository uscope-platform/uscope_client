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
import {MdInput, MdMemory, MdOutput} from "react-icons/md";
import {ColorTheme} from "#UI/index.js";

export interface LibraryEntry {
    id: string,
    name: string,
    description: string,
    icon: ReactNode,
    group: string,
    onAdd: () => void
}

interface EmulatorLibraryProps {
    enabled: boolean,
    onAddCore: () => void,
    onAddIo: (direction: "source" | "sink") => void
}

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
            description: "Runs a program",
            icon: <MdMemory size="1.5em"/>,
            group: "Compute",
            onAdd: props.onAddCore
        },
        {
            id: "io_source",
            name: "IO Source",
            description: "Data read from the bus",
            icon: <MdInput size="1.5em"/>,
            group: "External IO",
            onAdd: () => props.onAddIo("source")
        },
        {
            id: "io_sink",
            name: "IO Sink",
            description: "Data written to the bus",
            icon: <MdOutput size="1.5em"/>,
            group: "External IO",
            onAdd: () => props.onAddIo("sink")
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
                            title={"Add " + entry.name}
                            onClick={entry.onAdd}
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
