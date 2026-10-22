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

/// The column of panels beside a view: the panels keep their height and the column scrolls when they do not fit,
/// instead of squeezing the ones above
export const SidebarColumn = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  overflow-y: auto;
  & > * {
    flex-shrink: 0;
  }
`
