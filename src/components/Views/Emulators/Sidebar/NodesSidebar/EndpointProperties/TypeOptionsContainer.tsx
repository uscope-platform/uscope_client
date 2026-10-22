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
  margin-top: 1rem;
  padding-top: 0.7rem;
  border-top: 1px solid ${ColorTheme.background.borders};
`

const Heading = styled('div')`
  margin: 0 0 0.6rem 0.2rem;
  font-family: Roboto,Helvetica,Arial,sans-serif;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.6;
`

interface TypeOptionsContainerProps {
    children: React.ReactNode;
    label: string;
}

/// A titled group of the fields of a pane, they flow in the two columns of the grid
let TypeOptionsContainer = (props:TypeOptionsContainerProps) => {
    return (
        <Section>
            <Heading>{props.label}</Heading>
            <FieldGrid>
                {props.children}
            </FieldGrid>
        </Section>
    );
};

export default TypeOptionsContainer;
