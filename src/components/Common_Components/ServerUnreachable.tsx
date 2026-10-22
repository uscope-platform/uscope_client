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

import React from 'react';
import {styled} from "goober";

import {Button} from "#UI/index.js";

const Page = styled('div')`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 1rem;
  text-align: center;
`

interface ServerUnreachableProps {
    message: string;
    on_retry: () => void;
}

/// Shown when the platform cannot be asked what it needs, instead of a login that could not work
let ServerUnreachable = (props: ServerUnreachableProps) =>{
    return(
        <Page>
            <h1>Cannot reach the platform</h1>
            <p style={{opacity: 0.7}}>{props.message}</p>
            <Button onClick={props.on_retry}>Try again</Button>
        </Page>
    );
};

export default ServerUnreachable;
