// Copyright 2023 Filippo Savi
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

import {css} from "goober";
import {ColorTheme} from "#UI/index.js";
import EmulatorToolbar from "./EmulatorToolbar.jsx";
//@ts-ignore
import {Canvas, Edge, hasLink, MarkerArrow, Node, useSelection} from "reaflow";
import type {EmulatorGraphNode,EmulatorGraphEdge} from "#interfaces/index.js";

interface EmulatorDiagramProps {
    nodes: EmulatorGraphNode[];
    edges: EmulatorGraphEdge[];
    onNodeSelect: (event: any, node: EmulatorGraphNode) => void;
    onEdgeSelect: (event: any, edge: EmulatorGraphEdge) => void;
    onCanvasClick: () => void;
    onAdd: (event: React.MouseEvent<SVGElement, MouseEvent>) => void;
    onAddIo: (direction: "source" | "sink") => void;
    onRun: (event: React.MouseEvent<SVGElement, MouseEvent>) => void;
    onDeploy: (event: React.MouseEvent<SVGElement, MouseEvent>) => void;
    onDelete: () => void;
    onHardwareSim: (event: React.MouseEvent<SVGElement, MouseEvent>) => void;
    onEdit: (event: React.MouseEvent<SVGElement, MouseEvent>) => void;
    onCopy: (event: React.MouseEvent<SVGElement, MouseEvent>) => void;
    onLinkNodes: (event: any, from: EmulatorGraphNode, to:EmulatorGraphNode) => void;
    enabled_actions: {
        add: boolean,
        copy: boolean,
        edit: boolean,
        run: boolean,
        hw_sim: boolean,
        deploy: boolean,
        delete: boolean
    };
}

// the selected edge, the canvas has no other cue of it since its remove cross is not used
// the external sources and sinks, told apart from the cores and from each other
const io_source_class = css`
  rect& {
    stroke: rgb(60, 170, 100);
    stroke-width: 2px;
    stroke-dasharray: 6 3;
  }
`;

const io_sink_class = css`
  rect& {
    stroke: rgb(230, 140, 40);
    stroke-width: 2px;
    stroke-dasharray: 2 3;
  }
`;

const selected_edge_class = css`
  path& {
    stroke: ${ColorTheme.background.accents};
    stroke-width: 3px;
    /* beats the marker the canvas sets in the attribute, the marker of the arrow is shared by all the edges */
    marker-end: url(#end-arrow-selected);
  }
`;

let EmulatorDiagram = function (props: EmulatorDiagramProps) {

    const inner_nodes = props.nodes.map((node: EmulatorGraphNode) => {
        return node.kind === "io" ? {...node, className: node.direction === "source" ? io_source_class : io_sink_class} : {...node};
    });

    const inner_edges = props.edges.map((edge: EmulatorGraphEdge) => {
        let new_node = {...edge};
        new_node.id = new_node.id+ 10000;
        return new_node;
    });

    let { selections, onCanvasClick, onClick, onKeyDown, clearSelections } = useSelection({
        inner_nodes,
        inner_edges,
        onDataChange: (n:EmulatorGraphNode[], e: EmulatorGraphEdge[]) => {
        },
        onSelection: (s: any) => {
        }
    }
    );

    const drawn_edges = inner_edges.map((edge) => (
        selections.includes(edge.id) ? {...edge, className: selected_edge_class} : edge
    ));

    let handle_node_click = (event: any, node: EmulatorGraphNode) => {
        props.onNodeSelect(event, node);
        onClick(event,node);
    };

    let handle_edge_click = (event: any, edge: EmulatorGraphEdge) => {
        onClick(event,edge );
        let orig_edge = {...edge};
        orig_edge.id = orig_edge.id - 10000;
        props.onEdgeSelect(event, orig_edge);
    };

    let handle_canvas_click = () => {
        props.onCanvasClick();
        onCanvasClick();
    };

    let handle_layout_change = () => {
        //console.log('Layout', layout);
    }

    let handle_link_check = (event: any, from: number, to: number) => {
        return !hasLink(props.edges, from, to);
    };

    let handle_link_create = (event: any, from: EmulatorGraphNode, to: EmulatorGraphNode) => {
       props.onLinkNodes(event, from,to);
    };

    return(
        <div style={{
            height:"100%",
            display:"flex",
            flexDirection:"column"
        }}>
            <EmulatorToolbar
                onAdd={props.onAdd}
                onAddIo={props.onAddIo}
                onRun={props.onRun}
                onDeploy={props.onDeploy}
                onHardwareSim={props.onHardwareSim}
                onEdit={props.onEdit}
                onDelete={props.onDelete}
                enable={props.enabled_actions}
                onCopy={props.onCopy}
            />
            {/* reaflow 5.4.1 draws its arrow by spreading the element, which React warns about on every render: the
                marker is drawn here instead (the edges refer to it by id) and the one of the canvas is turned off */}
            <svg width={0} height={0} style={{position: "absolute"}} aria-hidden>
                <defs>
                    <MarkerArrow/>
                    <marker id="end-arrow-selected" viewBox="0 -4 8 8" refX="8" markerWidth="8" markerHeight="8" orient="auto">
                        <path d="M0,-4L8,0L0,4" style={{fill: ColorTheme.background.accents}}/>
                    </marker>
                </defs>
            </svg>
            <Canvas
                arrow={null}
                nodes={inner_nodes}
                edges={drawn_edges}
                selections={selections}
                height="550px"
                node={<Node onClick={handle_node_click} removable={false}/>}
                edge={<Edge onClick={handle_edge_click} removable={false}/>}
                onCanvasClick={handle_canvas_click}
                onLayoutChange={handle_layout_change}
                onNodeLinkCheck={handle_link_check}
                onNodeLink={handle_link_create}
            />
        </div>
    );
};


export default EmulatorDiagram;
