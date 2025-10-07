// Copyright 2021 Filippo Savi
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

import styled from "styled-components";


export const SelectableListLayout = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.25em;
    margin: 0.5em;

    /* Make the list track the parent height in both flex and non-flex parents */
    max-height: 13em;
    min-height: 0;
    width: 100%;
    /* The list itself becomes the scroll container */
    overflow-y: auto;
    

`
