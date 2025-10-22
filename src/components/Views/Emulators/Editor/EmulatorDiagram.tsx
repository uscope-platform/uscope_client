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

import EmulatorToolbar from "./EmulatorToolbar.jsx";
//@ts-ignore
import {Canvas, Edge, hasLink, Node, removeAndUpsertNodes, useSelection} from "reaflow";
import type {EmulatorGraphNode,EmulatorGraphEdge} from "#interfaces/index.js";

interface EmulatorDiagramProps {
    nodes: EmulatorGraphNode[];
    edges: EmulatorGraphEdge[];
    onNodeSelect: (event: any, node: EmulatorGraphNode) => void;
    onEdgeSelect: (event: any, edge: EmulatorGraphEdge) => void;
    onCanvasClick: () => void;
    onAdd: (event: React.MouseEvent<SVGElement, MouseEvent>) => void;
    onRun: (event: React.MouseEvent<SVGElement, MouseEvent>) => void;
    onDeploy: (event: React.MouseEvent<SVGElement, MouseEvent>) => void;
    onHardwareSim: (event: React.MouseEvent<SVGElement, MouseEvent>) => void;
    onEdit: (event: React.MouseEvent<SVGElement, MouseEvent>) => void;
    onCopy: (event: React.MouseEvent<SVGElement, MouseEvent>) => void;
    onLinkNodes: (event: any, from: EmulatorGraphNode, to:EmulatorGraphNode) => void;
    onNodeRemove: (result:{nodes:EmulatorGraphNode[],edges:EmulatorGraphEdge[]},node: EmulatorGraphNode) => void;
    onEdgeRemove: (edge:EmulatorGraphEdge) => void;
    enabled_actions: {
        add: boolean,
        copy: boolean,
        edit: boolean,
        run: boolean,
        hw_sim: boolean,
        deploy: boolean,
    };
}

let EmulatorDiagram = function (props: EmulatorDiagramProps) {

    const inner_nodes = props.nodes.map((node: EmulatorGraphNode) => {
        return {...node};
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

    let handle_node_remove = (event: any, node:EmulatorGraphNode) =>{
        props.onNodeRemove(removeAndUpsertNodes(props.nodes, props.edges, node), node);
    }

    let handle_edge_remove = (event: any, edge: EmulatorGraphEdge) =>{
        props.onEdgeRemove(edge);
    }

    return(
        <div style={{
            height:"100%",
            display:"flex",
            flexDirection:"column"
        }}>
            <EmulatorToolbar
                onAdd={props.onAdd}
                onRun={props.onRun}
                onDeploy={props.onDeploy}
                onHardwareSim={props.onHardwareSim}
                onEdit={props.onEdit}
                enable={props.enabled_actions}
                onCopy={props.onCopy}
            />
            <Canvas
                nodes={inner_nodes}
                edges={inner_edges}
                selections={selections}
                height="550px"
                node={<Node onClick={handle_node_click} onRemove={handle_node_remove}/>}
                edge={ <Edge onClick={handle_edge_click} onRemove={handle_edge_remove}/> }
                onCanvasClick={handle_canvas_click}
                onLayoutChange={handle_layout_change}
                onNodeLinkCheck={handle_link_check}
                onNodeLink={handle_link_create}
            />
        </div>
    );
};


export default EmulatorDiagram;
