// Copyright 2021 University of Nottingham Ningbo China
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

/// The fields of a properties pane: two columns with the label above each field, whatever width the pane has
export const FieldGrid = styled('div')`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.6rem 0.8rem;
  align-items: start;
`

/// The padding around the content of a properties pane
export const FieldPane = styled('div')`
  padding: 0.8rem 1rem 1rem;
`

/// A field that takes the whole row
export const FieldSpan = styled('div')`
  grid-column: 1 / -1;
`
