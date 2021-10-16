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

export const BlockLayout = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    grid-auto-rows: max-content;
    grid-row-gap: 1em;
    
    background-color: ${props => props.theme.dark_theme.level_1};
    border-radius: 1rem;
    padding: 1rem;
    height: fit-content;
    width: 100%;
    align-self: center;
    ${props => props.centered && css`
        margin-left: auto;
        margin-right: auto;
    `}
    
`
