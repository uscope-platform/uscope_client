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
import EmulatorLibrary from "./EmulatorLibrary.jsx";
import {Canvas, Edge, hasLink, MarkerArrow, Node, useSelection} from "reaflow";
import type {EdgeData, NodeData} from "reaflow";
import type {EmulatorGraphNode,EmulatorGraphEdge} from "#interfaces/index.js";

type GraphMouseEvent = React.MouseEvent<SVGGElement, MouseEvent>;

// reaflow identifies the nodes and the edges with strings, in the same space (the selections hold both): the edges are
// told apart with a prefix
const node_key = (id: number) => String(id);
const edge_key = (id: number) => "edge-" + id;

interface EmulatorDiagramProps {
    nodes: EmulatorGraphNode[];
    edges: EmulatorGraphEdge[];
    onNodeSelect: (event: GraphMouseEvent, node: EmulatorGraphNode) => void;
    onEdgeSelect: (event: GraphMouseEvent, edge: EmulatorGraphEdge) => void;
    onCanvasClick: () => void;
    onAdd: () => void;
    onAddIo: (direction: "source" | "sink") => void;
    onRun: (event: React.MouseEvent<SVGElement, MouseEvent>) => void;
    onDeploy: (event: React.MouseEvent<SVGElement, MouseEvent>) => void;
    onDelete: () => void;
    onHardwareSim: (event: React.MouseEvent<SVGElement, MouseEvent>) => void;
    onEdit: (event: React.MouseEvent<SVGElement, MouseEvent>) => void;
    onCopy: (event: React.MouseEvent<SVGElement, MouseEvent>) => void;
    onLinkNodes: (event: unknown, from: EmulatorGraphNode, to:EmulatorGraphNode) => void;
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

    const inner_nodes: NodeData[] = props.nodes.map((node: EmulatorGraphNode) => {
        const {id, ...rest} = node;
        const drawn: NodeData = {...rest, id: node_key(id)};
        if(node.kind === "io") drawn.className = node.direction === "source" ? io_source_class : io_sink_class;
        return drawn;
    });

    const inner_edges: EdgeData[] = props.edges.map((edge: EmulatorGraphEdge) => ({
        id: edge_key(edge.id),
        from: node_key(edge.from),
        to: node_key(edge.to)
    }));

    let { selections, onCanvasClick, onClick } = useSelection({
        nodes: inner_nodes,
        edges: inner_edges
    });

    const drawn_edges: EdgeData[] = inner_edges.map((edge) => (
        selections.includes(edge.id) ? {...edge, className: selected_edge_class} : edge
    ));

    const model_node = (data: NodeData) => props.nodes.find((n) => node_key(n.id) === data.id);

    let handle_node_click = (event: GraphMouseEvent, data: NodeData) => {
        const node = model_node(data);
        if(node === undefined) return;
        props.onNodeSelect(event, node);
        onClick?.(event, data);
    };

    let handle_edge_click = (event: GraphMouseEvent, data: EdgeData) => {
        onClick?.(event, data);
        const edge = props.edges.find((e) => edge_key(e.id) === data.id);
        if(edge === undefined) return;
        props.onEdgeSelect(event, edge);
    };

    let handle_canvas_click = () => {
        props.onCanvasClick();
        onCanvasClick?.();
    };

    let handle_layout_change = () => {
        //console.log('Layout', layout);
    }

    let handle_link_check = (event: unknown, from: NodeData, to: NodeData) => {
        return !hasLink(inner_edges, from, to);
    };

    let handle_link_create = (event: unknown, from: NodeData, to: NodeData) => {
        const from_node = model_node(from);
        const to_node = model_node(to);
        if(from_node === undefined || to_node === undefined) return;
        props.onLinkNodes(event, from_node, to_node);
    };

    return(
        <div style={{
            height:"100%",
            display:"flex",
            flexDirection:"column"
        }}>
            <EmulatorToolbar
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
            <div style={{display: "flex", flexDirection: "row", minHeight: 0}}>
            <EmulatorLibrary
                enabled={props.enabled_actions.add}
                onAddCore={props.onAdd}
                onAddIo={props.onAddIo}
            />
            <div style={{flexGrow: 1, minWidth: 0}}>
            <Canvas
                arrow={null}
                nodes={inner_nodes}
                edges={drawn_edges}
                selections={selections}
                height={550}
                node={<Node onClick={handle_node_click} removable={false}/>}
                edge={<Edge onClick={handle_edge_click} removable={false}/>}
                onCanvasClick={handle_canvas_click}
                onLayoutChange={handle_layout_change}
                onNodeLinkCheck={handle_link_check}
                onNodeLink={handle_link_create}
            />
            </div>
            </div>
        </div>
    );
};


export default EmulatorDiagram;
