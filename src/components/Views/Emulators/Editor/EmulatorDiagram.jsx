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

import EmulatorToolbar from "./EmulatorToolbar";
import {Canvas, Edge, hasLink, Node, removeAndUpsertNodes, useSelection} from "reaflow";

let EmulatorDiagram = function (props) {

    const inner_nodes = props.nodes;
    const inner_edges = props.edges;

    let { selections, onCanvasClick, onClick, onKeyDown, clearSelections } = useSelection({
        inner_nodes,
        inner_edges,
        onDataChange: (n, e) => {
            props.setNodes(n);
            props.setEdges(e);
        },
        onSelection: (s) => {
        }
    }
    );

    let handle_node_click = (event, node) => {
        props.onNodeSelect(event, node);
        onClick(event,node);
    };

    let handle_edge_click = (event, edge) => {
        props.onEdgeSelect(event, edge);
        onClick(event, edge);
    };

    let handle_canvas_click = () => {
        props.onCanvasClick();
        onCanvasClick();
    };

    let handle_layout_change = () => {
        //console.log('Layout', layout);
    }

    let handle_link_check = (event, from, to) => {
        return !hasLink(props.edges, from, to);
    };

    let handle_link_create = (event, from, to) => {
       props.onLinkNodes(event, from,to);
    };

    let handle_node_remove = (event, node) =>{
        props.onNodeRemove(removeAndUpsertNodes(props.nodes, props.edges, node), node);
    }

    let handle_edge_remove = (event, edge) =>{
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
                onBuild={props.onBuild}
                onRun={props.onRun}
                onDeploy={props.onDeploy}
                onEdit={props.onEdit}
                enable={props.enabled_actions}
                onShow={props.onShow}
            />
            <Canvas
                nodes={props.nodes}
                edges={props.edges}
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
