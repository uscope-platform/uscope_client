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

const Dialog = styled('div')`
  background: ${ColorTheme.background.select_background};
  border: 1px solid ${ColorTheme.background.borders};
  border-radius: 8px;
  color: ${ColorTheme.text};
  width: min(24rem, 100%);
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

const DangerButton = styled(Button)`
  background: ${ColorTheme.field.error};
  border-color: ${ColorTheme.field.error};
`

interface ConfirmDialogProps {
    title: string;
    message: string;
    confirm_label: string;
    /// the dialog offers to not be asked again, as it does unless this is false
    allow_skip?: boolean;
    /// the user chose not to be asked again when it is true
    onConfirm: (do_not_ask_again: boolean) => void;
    onCancel: () => void;
}

/// Asks the user to confirm something that cannot be undone, with the choice of not being asked again
export const ConfirmDialog = (props: ConfirmDialogProps) => {
    const [do_not_ask_again, set_do_not_ask_again] = useState(false);
    const {onCancel} = props;

    useEffect(() => {
        const cancel_on_escape = (event: KeyboardEvent) => {
            if(event.key === "Escape") onCancel();
        };
        window.addEventListener("keydown", cancel_on_escape);
        return () => window.removeEventListener("keydown", cancel_on_escape);
    }, [onCancel]);

    return createPortal(
        // the dialog is a child of what opened it in the tree of React, what happens in it must not reach that
        <Overlay onClick={(event) => {event.stopPropagation(); onCancel();}} onContextMenu={(event) => event.stopPropagation()}>
            <Dialog role="alertdialog" aria-label={props.title} onClick={(event) => event.stopPropagation()}>
                <div style={{fontWeight: "bold"}}>{props.title}</div>
                <div>{props.message}</div>
                {props.allow_skip !== false && (
                    <label style={{display: "flex", alignItems: "center", gap: "0.5em", cursor: "pointer"}}>
                        <input type="checkbox" checked={do_not_ask_again} onChange={(event) => set_do_not_ask_again(event.target.checked)}/>
                        Don't ask me again
                    </label>
                )}
                <Footer>
                    <CancelButton onClick={props.onCancel}>Cancel</CancelButton>
                    <DangerButton onClick={() => props.onConfirm(do_not_ask_again)} autoFocus>{props.confirm_label}</DangerButton>
                </Footer>
            </Dialog>
        </Overlay>,
        document.body
    );
};
