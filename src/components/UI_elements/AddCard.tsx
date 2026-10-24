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

import React from 'react';
import type {ReactNode} from 'react';
import {MdAdd} from "react-icons/md";
import {ColorTheme} from "./ColorTheme.js";

interface AddCardProps {
    label: string;
    onClick: () => void;
    /// a second action of the card, next to the first one: like importing an item instead of creating it
    secondary?: {label: string, icon: ReactNode, onClick: () => void} | undefined;
}

/// The row on top of a list that adds an item to it
export const AddCard = (props: AddCardProps) => {
    return(
        <div
            style={{
                display: "flex",
                alignItems: "center",
                gap: "0.4em",
                margin: "0.5em 0.5em 0",
                padding: "0.3em 0.5em",
                border: "1px dashed " + ColorTheme.background.bordersLight,
                borderRadius: "5px",
                cursor: "pointer",
                color: ColorTheme.icons_color,
            }}
        >
            <div onClick={props.onClick} style={{display: "flex", alignItems: "center", gap: "0.4em", flexGrow: 1}}>
                <MdAdd size="1.2em"/>
                <span>{props.label}</span>
            </div>
            {props.secondary && (
                <div
                    role="button"
                    title={props.secondary.label}
                    onClick={props.secondary.onClick}
                    style={{display: "flex", alignItems: "center", gap: "0.3em", paddingLeft: "0.6em", borderLeft: "1px solid " + ColorTheme.background.bordersLight}}
                >
                    {props.secondary.icon}
                    <span>{props.secondary.label}</span>
                </div>
            )}
        </div>
    );
};
