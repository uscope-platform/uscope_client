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

export const ApplicationLayout = styled.div`
    display: grid;
    grid-template-columns: 2fr 8fr 2fr;
    grid-gap: 1.5rem;
    margin: 1rem 0 0 0;
    grid-auto-rows: auto;
    height: 96.5vh;
    ${props => !props.sidebarNeeded && css`
        grid-template-columns: 2fr 10fr;
    `}
 
`