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

import styled, {css} from "styled-components";

export const SidebarContentLayout = styled.div`
  display: grid;
  height: 100vh;
  grid-template-columns: 1fr;
  ${props => props.peripheral && css`
        grid-auto-rows: auto auto 10fr auto;
  `}
  ${props => props.application && css`
        grid-auto-rows: auto 10fr auto;
  `}
  grid-gap: 0.5rem;
  margin-left: 0.8rem;
  margin-right: 0.8rem;
  justify-items: center;
`