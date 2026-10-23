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

import React, {useState} from "react";
import {createPortal} from "react-dom";
import {styled} from "goober";
import {Button} from "./Button.js";
import {ColorTheme} from "./ColorTheme.js";

const Overlay = styled('div')`
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`

const Dialog = styled('form')`
  background: ${ColorTheme.background.select_background};
  border: 1px solid ${ColorTheme.background.borders};
  border-radius: 8px;
  color: ${ColorTheme.text};
  width: min(22rem, 100%);
  padding: 1rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
`

const Footer = styled('div')`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
`

const CancelButton = styled('button')`
  background: transparent;
  border: 1px solid ${ColorTheme.background.bordersLight};
  border-radius: 3px;
  font-size: 16px;
  color: ${ColorTheme.text};
  padding: 0.5em 1em;
`

interface PromptDialogProps {
    title: string;
    initial_value: string;
    confirm_label: string;
    /// the reason the value is refused, when it is
    validate?: (value: string) => string | null;
    onConfirm: (value: string) => void;
    onCancel: () => void;
}

/// Asks the user for a text, like the new name of something. Only Cancel, Escape and the confirmation close it, so that a
/// stray click does not lose what was typed.
export const PromptDialog = (props: PromptDialogProps) => {
    const [value, set_value] = useState(props.initial_value);
    const problem = value.trim() === "" ? "The name cannot be empty." : props.validate?.(value) ?? null;

    return createPortal(
        // the dialog is a child of what opened it in the tree of React, what happens in it must not reach that
        <Overlay onClick={(event) => event.stopPropagation()} onContextMenu={(event) => event.stopPropagation()}>
            <Dialog
                role="dialog"
                aria-label={props.title}
                onSubmit={(event) => {
                    event.preventDefault();
                    if(problem === null) props.onConfirm(value);
                }}
                onKeyDown={(event) => {
                    if(event.key === "Escape") props.onCancel();
                }}
            >
                <div style={{fontWeight: "bold"}}>{props.title}</div>
                <input
                    autoFocus
                    value={value}
                    onFocus={(event) => event.currentTarget.select()}
                    onChange={(event) => set_value(event.target.value)}
                    style={{width: "100%", boxSizing: "border-box", outline: problem !== null ? "1px solid " + ColorTheme.field.error : undefined}}
                />
                <div style={{minHeight: "1.2em", fontSize: "0.85em", color: ColorTheme.field.error}}>{problem ?? ""}</div>
                <Footer>
                    <CancelButton type="button" onClick={props.onCancel}>Cancel</CancelButton>
                    <Button type="submit">{props.confirm_label}</Button>
                </Footer>
            </Dialog>
        </Overlay>,
        document.body
    );
};
