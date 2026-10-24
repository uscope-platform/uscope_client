// Copyright 2025 Filippo Savi
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
import {styled} from "goober";
import {ColorTheme, FieldGrid} from "#UI/index.js";

const Section = styled('div')`
  padding-left: 1rem;
  border-left: 1px solid ${ColorTheme.background.bordersLight};
  &:first-child {
    padding-left: 0;
    border-left: 0;
  }
  /* what is only for the emulation is a box of its own, dashed: it is not on the hardware */
  &[data-emulation-only], &[data-emulation-only]:first-child {
    padding: 0.6rem 0.8rem 0.8rem;
    border: 1px dashed ${ColorTheme.background.bordersLight};
    border-radius: 8px;
    background: ${ColorTheme.background.level_4};
  }
`

const HeadingRow = styled('div')`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.3rem 0.6rem;
  margin: 0 0 0.6rem 0.2rem;
`

const Heading = styled('div')`
  font-family: Roboto,Helvetica,Arial,sans-serif;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.6;
`

const Badge = styled('span')`
  display: inline-flex;
  align-items: center;
  gap: 0.3em;
  padding: 0.05em 0.6em;
  border-radius: 1em;
  font-size: 0.7rem;
  border: 1px solid ${ColorTheme.background.bordersLight};
  opacity: 0.85;
`

interface TypeOptionsContainerProps {
    children: React.ReactNode;
    label: string;
    /// tells where the fields of the group are used, like on the hardware or only in the emulation
    badge?: {icon: React.ReactNode, text: string} | undefined;
    /// the fields are used in the emulation only, the group is drawn apart for it to be told from the ones that describe the hardware
    emulation_only?: boolean | undefined;
}

/// A titled group of the fields of a pane, they flow in the two columns of the grid
let TypeOptionsContainer = (props:TypeOptionsContainerProps) => {
    return (
        <Section data-emulation-only={props.emulation_only ? "" : undefined}>
            <HeadingRow>
                <Heading>{props.label}</Heading>
                {props.badge && <Badge>{props.badge.icon}{props.badge.text}</Badge>}
            </HeadingRow>
            <FieldGrid>
                {props.children}
            </FieldGrid>
        </Section>
    );
};

export default TypeOptionsContainer;
