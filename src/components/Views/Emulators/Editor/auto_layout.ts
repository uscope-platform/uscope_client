/*
 * Copyright(c) 2025. Filippo Savi
 * Author: Filippo Savi <filssavi@gmail.com>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */

import type {EmulatorGraphEdge, EmulatorGraphNode, emulator_layout} from "#interfaces/index.js";

export const NODE_WIDTH = 160;
export const NODE_HEIGHT = 56;
const COLUMN_GAP = 90;
const ROW_GAP = 40;

/// Where to draw the nodes that were never placed: in columns by the longest path that reaches them, so the data flows
/// from the left to the right. The nodes in a cycle stay in the column where the walk found them
export const auto_layout = (nodes: EmulatorGraphNode[], edges: EmulatorGraphEdge[]): emulator_layout => {
    const ids = new Set(nodes.map((n) => n.id));
    const incoming = new Map<number, number[]>();
    for(const e of edges){
        if(!ids.has(e.from) || !ids.has(e.to) || e.from === e.to) continue;
        incoming.set(e.to, [...(incoming.get(e.to) ?? []), e.from]);
    }

    const column = new Map<number, number>();
    const rank = (id: number, walking: Set<number>): number =>{
        const known = column.get(id);
        if(known !== undefined) return known;
        // a cycle: the node being walked is not ranked again
        if(walking.has(id)) return 0;
        walking.add(id);
        const value = Math.max(-1, ...(incoming.get(id) ?? []).map((from) => rank(from, walking))) + 1;
        walking.delete(id);
        column.set(id, value);
        return value;
    };

    const rows = new Map<number, number>();
    const layout: emulator_layout = {};
    for(const n of nodes){
        const c = rank(n.id, new Set());
        const row = rows.get(c) ?? 0;
        rows.set(c, row + 1);
        layout[n.id] = {x: c * (NODE_WIDTH + COLUMN_GAP), y: row * (NODE_HEIGHT + ROW_GAP)};
    }
    return layout;
};
