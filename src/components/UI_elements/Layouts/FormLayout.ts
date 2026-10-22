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

interface FormLayoutProps {
    /// minimum width of a column, the form then flows in as many columns as fit
    columns?: string | undefined;
}

export const FormLayout = styled<'div', FormLayoutProps>('div')(({ columns }) => `
    display: grid;
    margin: 1em;
    grid-template-rows: auto;
    ${columns ? `grid-template-columns: repeat(auto-fill, minmax(${columns}, 1fr));` : "grid-auto-columns: auto;"}
    grid-gap: ${columns ? "1rem" : "0.4rem"};
    align-items: start;
`)
