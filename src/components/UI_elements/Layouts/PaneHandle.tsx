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
import {css} from 'goober';
import {Separator} from 'react-resizable-panels';
import {ColorTheme} from "../ColorTheme.js";

// the gap between the panes is the handle: the line shows up on hover, focus and drag
const handle_class = css`
    position: relative;
    outline: none;
    &::after {
        content: "";
        position: absolute;
        border-radius: 2px;
        background: transparent;
        transition: background 0.15s;
    }
    &[aria-orientation="vertical"] {
        width: 10px;
        cursor: col-resize;
    }
    &[aria-orientation="horizontal"] {
        height: 10px;
        cursor: row-resize;
    }
    &[aria-orientation="vertical"]::after {
        top: 0;
        bottom: 0;
        left: 3px;
        width: 4px;
    }
    &[aria-orientation="horizontal"]::after {
        left: 0;
        right: 0;
        top: 3px;
        height: 4px;
    }
    &[data-separator="hover"]::after,
    &[data-separator="focus"]::after {
        background: ${ColorTheme.background.bordersLight};
    }
    &[data-separator="active"]::after {
        background: ${ColorTheme.background.accents};
    }
`;

/// Dragging it, or the arrow keys when it has the focus, resizes the neighbours; double click gives back the default sizes
export const PaneHandle = () => <Separator className={handle_class}/>;
