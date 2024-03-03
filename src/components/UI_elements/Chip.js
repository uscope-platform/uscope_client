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

import styled from 'styled-components';

export const Chip = styled.label`
  background: ${props=> props.theme.scope_status[props.status]};
  border-color: ${props => props.theme.scope_status[props.status]};
    display: ${props => props.status ? "block": "none"};
  font-weight: bold;
  border-radius: 9999999px;
  border-style: solid;
  font-size: 16px;
  color: black;
  width: fit-content;
  height: fit-content;
  padding: 0.5em 1em;
`