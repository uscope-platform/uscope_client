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

import React, {useEffect, useState} from 'react';
import {createPortal} from "react-dom";
import {styled} from "goober";

import {Button, ColorTheme} from "#UI/index.js";
import type {
    change_kind,
    conflict_resolution,
    peripheral_conflict,
    property_change
} from "#client_core/index.js";

const KIND_COLORS: Record<change_kind, string> = {
    added: "rgb(141, 229, 161)",
    removed: "rgb(255, 159, 155)",
    modified: ColorTheme.background.accents
};
const KIND_LABELS: Record<change_kind, string> = {added: "Added", removed: "Removed", modified: "Modified"};
const OLD_TINT = "rgba(255, 159, 155, 0.16)";
const NEW_TINT = "rgba(141, 229, 161, 0.16)";

const Overlay = styled('div')`
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;

const Dialog = styled('div')`
  background: #1e1e1e;
  border: 1px solid ${ColorTheme.background.borders};
  border-radius: 8px;
  color: ${ColorTheme.text};
  width: min(56rem, 100%);
  max-height: 100%;
  display: flex;
  flex-direction: column;
`;

const Header = styled('div')`
  padding: 1rem 1.25rem 0.75rem;
  border-bottom: 1px solid ${ColorTheme.background.borders};
`;

const Body = styled('div')`
  padding: 0.75rem 1.25rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const Footer = styled('div')`
  padding: 0.75rem 1.25rem 1rem;
  border-top: 1px solid ${ColorTheme.background.borders};
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
`;

const ChangeBlock = styled('div')`
  border: 1px solid ${ColorTheme.background.borders};
  border-left-width: 4px;
  border-radius: 4px;
  padding: 0.5rem 0.75rem;
`;

const Table = styled('table')`
  border-collapse: collapse;
  width: 100%;
  font-size: 0.9em;
  table-layout: fixed;
  & th {
    text-align: left;
    font-weight: normal;
    color: ${ColorTheme.inactive_icons_color};
    padding: 0.15rem 0.5rem;
  }
  & td {
    padding: 0.15rem 0.5rem;
    overflow-wrap: anywhere;
    vertical-align: top;
  }
`;

const Muted = styled('span')`
  color: ${ColorTheme.inactive_icons_color};
`;

const Note = styled('div')`
  background: rgba(255, 181, 69, 0.12);
  border-left: 4px solid ${ColorTheme.background.accents};
  border-radius: 4px;
  padding: 0.4rem 0.75rem;
  font-size: 0.9em;
`;

const SecondaryButton = styled(Button)`
  background: transparent;
  color: ${ColorTheme.text};
`;

const PropertyTable = (props: { properties: property_change[], old_label: string, new_label: string }) => {
    if (props.properties.length === 0) return null;
    return (
        <Table>
            <colgroup><col style={{width: "24%"}}/><col style={{width: "38%"}}/><col style={{width: "38%"}}/></colgroup>
            <thead><tr><th/><th>{props.old_label}</th><th>{props.new_label}</th></tr></thead>
            <tbody>
            {props.properties.map(p => (
                <tr key={p.property}>
                    <td>{p.property}</td>
                    <td style={{background: p.old_value === undefined ? "transparent" : OLD_TINT}}>
                        {p.old_value ?? <Muted>-</Muted>}
                    </td>
                    <td style={{background: p.new_value === undefined ? "transparent" : NEW_TINT}}>
                        {p.new_value ?? <Muted>-</Muted>}
                    </td>
                </tr>
            ))}
            </tbody>
        </Table>
    );
};

const KindBadge = (props: { kind: change_kind }) => (
    <span style={{color: KIND_COLORS[props.kind], fontWeight: "bold", marginRight: "0.5rem"}}>
        {KIND_LABELS[props.kind]}
    </span>
);

const pluralize = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;

interface ImportConflictDialogProps {
    conflict: peripheral_conflict;
    // called with the choice, and true when it has to be used for all the remaining conflicts of the same file too
    onResolve: (resolution: conflict_resolution, apply_to_all: boolean) => void;
}

/// Shows what an imported peripheral would change in the stored one it clashes with, and lets the user choose which
/// one to use. Closing it (Escape) keeps the stored one, which is the choice that can not lose anything
export const ImportConflictDialog = (props: ImportConflictDialogProps) => {
    const {existing, incoming, diff} = props.conflict;
    const [apply_to_all, set_apply_to_all] = useState(false);
    const remaining = props.conflict.total - props.conflict.index - 1;

    useEffect(() => {
        const on_key = (e: KeyboardEvent) => {
            if (e.key === "Escape") props.onResolve("keep_old", false);
        };
        window.addEventListener("keydown", on_key);
        return () => window.removeEventListener("keydown", on_key);
    }, [props.onResolve]);

    const matched_by = existing.name === incoming.name
        ? (existing.id === incoming.id ? "name and id" : "name")
        : "id";
    const counts = (kind: change_kind) => diff.registers.filter(r => r.kind === kind).length;
    const summary_parts = [
        counts("modified") > 0 ? `${pluralize(counts("modified"), "register")} modified` : null,
        counts("added") > 0 ? `${counts("added")} added` : null,
        counts("removed") > 0 ? `${counts("removed")} removed` : null,
        diff.properties.length > 0 ? `${pluralize(diff.properties.length, "property")} changed` : null
    ].filter(p => p !== null);

    return createPortal(
        <Overlay>
            <Dialog role="dialog" aria-modal="true" aria-labelledby="import_conflict_title">
                <Header>
                    <h3 id="import_conflict_title" style={{fontSize: "1.2em"}}>
                        "{incoming.name}" is already in the peripherals
                        {props.conflict.total > 1 && <Muted> ({props.conflict.index + 1} of {props.conflict.total})</Muted>}
                    </h3>
                    <div style={{marginTop: "0.25rem"}}>
                        The imported peripheral (id {incoming.id}) has the same {matched_by} as the stored one
                        (id {existing.id}). {summary_parts.length > 0 ? summary_parts.join(", ") + "." : ""}
                    </div>
                    {props.conflict.keep_both_name !== incoming.name &&
                        <div style={{marginTop: "0.25rem"}}>
                            <Muted>Keep both imports it as "{props.conflict.keep_both_name}".</Muted>
                        </div>
                    }
                </Header>

                <Body>
                    {(diff.registers_reordered || diff.registers.some(r => r.fields_reordered)) &&
                        <Note>
                            The order of the registers or fields differs. The addresses and offsets follow the order,
                            so they would change even where the values are the same.
                        </Note>
                    }

                    {diff.properties.length > 0 &&
                        <ChangeBlock style={{borderLeftColor: KIND_COLORS.modified}}>
                            <div style={{marginBottom: "0.25rem"}}><KindBadge kind="modified"/>Peripheral</div>
                            <PropertyTable properties={diff.properties} old_label="Stored" new_label="Imported"/>
                        </ChangeBlock>
                    }

                    {diff.registers.map(register => (
                        <ChangeBlock key={register.id} style={{borderLeftColor: KIND_COLORS[register.kind]}}>
                            <div style={{marginBottom: "0.25rem"}}>
                                <KindBadge kind={register.kind}/>
                                Register {register.name}
                                {register.name !== register.id && <Muted> ({register.id})</Muted>}
                                {register.fields_reordered && <Muted> - field order changed</Muted>}
                            </div>
                            <PropertyTable properties={register.properties} old_label="Stored" new_label="Imported"/>
                            {register.fields.map(f => (
                                <div key={f.name} style={{marginTop: "0.4rem", paddingLeft: "0.75rem"}}>
                                    <KindBadge kind={f.kind}/>Field {f.name}
                                    {/* the values of a whole added or removed field are not a change worth listing */}
                                    {f.kind === "modified" &&
                                        <PropertyTable properties={f.properties} old_label="Stored" new_label="Imported"/>}
                                </div>
                            ))}
                        </ChangeBlock>
                    ))}
                </Body>

                <Footer>
                    {remaining > 0 &&
                        <label style={{display: "flex", alignItems: "center", gap: "0.5rem", marginRight: "auto"}}>
                            <input
                                type="checkbox"
                                checked={apply_to_all}
                                onChange={e => set_apply_to_all(e.target.checked)}
                            />
                            Do the same for the other {remaining} without asking
                        </label>
                    }
                    <div style={{display: "flex", gap: "0.5rem", marginLeft: "auto", flexWrap: "wrap"}}>
                        <SecondaryButton autoFocus onClick={() => props.onResolve("keep_old", apply_to_all)}>
                            Keep stored
                        </SecondaryButton>
                        <SecondaryButton
                            title={`Import it as a new peripheral named "${props.conflict.keep_both_name}"`}
                            onClick={() => props.onResolve("keep_both", apply_to_all)}>
                            Keep both
                        </SecondaryButton>
                        <Button
                            title="Replace the stored peripheral, keeping its id"
                            onClick={() => props.onResolve("use_new", apply_to_all)}>
                            Use imported
                        </Button>
                    </div>
                </Footer>
            </Dialog>
        </Overlay>,
        document.body
    );
};
