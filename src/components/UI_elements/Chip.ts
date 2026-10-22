// Copyright 2024 Filippo Savi
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

import { styled } from 'goober';
import {ColorTheme} from "./ColorTheme.js";
import type {ScopeStatus} from "#interfaces/index.js";

interface ChipProps {
    status: ScopeStatus;
}


export const Chip = styled<'span', ChipProps>('span')(({ status }) => {
    const color = ColorTheme.scope_status[status] ?? ColorTheme.scope_status["unknown"];
    // the pastel status colors vanish on a light background: darken the ones that carry the meaning toward the text color
    const strong = `color-mix(in srgb, ${color} 55%, ${ColorTheme.text})`;
    return `
  display: ${status ? "inline-flex" : "none"};
  align-items: center;
  gap: 0.5em;
  width: fit-content;
  padding: 0.25em 0.8em 0.25em 0.65em;
  border: 1px solid ${strong};
  border-radius: 9999px;
  background: color-mix(in srgb, ${color} 30%, ${ColorTheme.background.level_2});
  color: ${ColorTheme.text};
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  white-space: nowrap;
  &::before {
    content: "";
    width: 0.55em;
    height: 0.55em;
    border-radius: 50%;
    background: ${strong};
  }
`;
});
