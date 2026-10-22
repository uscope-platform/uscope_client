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
import {ColorTheme} from "./ColorTheme.js";

const Scroller = styled('div')`
  height: 100%;
  overflow: auto;
`

const Table = styled('table')`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.85rem;
  th, td {
    padding: 0.25rem 0.8rem;
    text-align: left;
    white-space: nowrap;
  }
  th {
    position: sticky;
    top: 0;
    z-index: 1;
    background: ${ColorTheme.background.level_3};
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    opacity: 0.85;
  }
  td.number {
    font-family: monospace;
    text-align: right;
  }
  th.number {
    text-align: right;
  }
  tbody tr:nth-of-type(even) {
    background: ${ColorTheme.background.level_3};
  }
  tbody tr:hover {
    background: ${ColorTheme.background.level_4};
  }
`

const Empty = styled('div')`
  padding: 0.8rem;
  font-size: 0.85rem;
  opacity: 0.5;
`

export interface DataTableColumn {
    title: string;
    // the values are numbers, shown in a monospace font and aligned to the right
    numeric?: boolean;
}

interface DataTableProps {
    columns: DataTableColumn[];
    rows: string[][];
    empty?: string;
}

/// A table that scrolls in the space it is given, with its header kept in view
export let DataTable = (props: DataTableProps) => {
    if(props.rows.length === 0){
        return <Empty>{props.empty ?? "Nothing to show"}</Empty>;
    }
    return (
        <Scroller>
            <Table>
                <thead>
                    <tr>
                        {props.columns.map((column) => (
                            <th key={column.title} className={column.numeric ? "number" : ""}>{column.title}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {props.rows.map((row, i) => (
                        <tr key={i}>
                            {row.map((cell, j) => (
                                <td key={j} className={props.columns[j]?.numeric ? "number" : ""}>{cell}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Scroller>
    );
};
