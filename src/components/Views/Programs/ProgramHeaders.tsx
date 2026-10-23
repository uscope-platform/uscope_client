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

import React, {useEffect} from "react";

import {Checkbox, FieldPane} from "#UI/index.js";
import {up_program} from "#client_core/index.js";
import type {program} from "#interfaces/index.js";

interface ProgramHeadersProps {
    program: up_program;
    /// all the programs, the headers are the ones of the type H
    programs: Record<number, program>;
}

/// The headers that the selected program includes, picked from the programs of the type H
let ProgramHeaders = (props: ProgramHeadersProps) =>{

    const headers = Object.values(props.programs).filter((p) => p.type === "H" && p.id !== props.program.id);

    // the headers that do not exist anymore are dropped
    useEffect(() => {
        for(const id of props.program.headers ?? []){
            if(!Object.values(props.programs).some((p) => p.type === "H" && p.id === id)){
                props.program.remove_header(id).then();
            }
        }
    }, [props.programs, props.program.id]);

    if(headers.length === 0){
        return <div style={{margin: "0.5em", opacity: 0.6}}>There are no headers yet, they are the programs of the type H.</div>;
    }

    return(
        <FieldPane>
            {headers.map((header) => (
                <Checkbox
                    key={header.id}
                    name={"header_" + header.id}
                    label={header.name}
                    value={props.program.headers?.includes(header.id) ?? false}
                    onChange={(event) => {
                        const included = event.target.checked;
                        (included ? props.program.add_header(header.id) : props.program.remove_header(header.id)).then();
                    }}
                />
            ))}
        </FieldPane>
    );
};

export default ProgramHeaders;
