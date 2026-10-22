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


import React from 'react';
import {DataTable, SimpleContent, UIPanel} from "#UI/index.js";
import type {TranslationTableEntry} from "#interfaces/index.js";

interface TranslationTableProps {
    channel_io: TranslationTableEntry[]
    common_io: TranslationTableEntry[]
    height: string,
}

const COLUMNS = [{title: "Name"}, {title: "Kind"}, {title: "I/O side", numeric: true}, {title: "Core side", numeric: true}];

const to_rows = (entries: TranslationTableEntry[] | undefined, kind: string) =>
    (entries ?? []).map((entry) => [entry[1].name, kind, entry[0].toString(), entry[1].address.toString()]);

let  TranslationTable = (props: TranslationTableProps) =>{
    const channel_rows = to_rows(props.channel_io, "channel");
    const common_rows = to_rows(props.common_io, "common");

    return (
        <UIPanel key="translation_table" level="level_2">
            <SimpleContent name={"Translation table"} height={props.height}>
                {channel_rows.length === 0 && common_rows.length === 0
                    ? <DataTable columns={COLUMNS} rows={[]} empty="Select a program to see where its I/O is mapped"/>
                    : <DataTable
                        columns={COLUMNS}
                        rows={[...channel_rows, ...common_rows]}
                    />}
            </SimpleContent>
        </UIPanel>
    );
};

export default TranslationTable;
