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

import React, {useCallback, useEffect, useState} from 'react';
import Dagre from '@dagrejs/dagre';

import {
    ReactFlow,
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    useReactFlow
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';
import {position} from "plotly.js/src/plots/cartesian/layout_attributes.js";

const getLayoutedElements = (nodes, edges, options) => {
    const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
    g.setGraph({
        rankdir: options.direction,
        ranksep: 100,
        ranker: 'tight-tree',
    });

    edges.forEach((edge) => g.setEdge(edge.source, edge.target));
    nodes.forEach((node) =>
        g.setNode(node.id, {
            ...node,
            width: node.measured?.width ?? 0,
            height: node.measured?.height ?? 0,
        }),
    );

    Dagre.layout(g);

    return {
        nodes: nodes.map((node) => {
            const position = g.node(node.id);
            // We are shifting the dagre node position (anchor=center center) to the top left
            // so it matches the React Flow node anchor point (top left).
            const x = position.x - (node.measured?.width ?? 0) / 2;
            const y = position.y - (node.measured?.height ?? 0) / 2;

            return { ...node, position: { x, y } };
        }),
        edges,
    };
};

let NewEmulatorDiagram = function (props) {

    let [update_state, set_update_state] = useState(false)

    const { fitView } = useReactFlow();
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    useEffect(()=>{
        setNodes(props.nodes.map((node, index) => {
            return {
                id: String(node.id),
                position: {x: 100, y: index*100+ 20},
                data: {label:node.text}
            };
        }));
        setEdges(props.edges.map((edge, index) => {
            return {
                id: String(index),
                source: String(edge.from),
                target: String(edge.to),
                animated: true,
            }
        }));
        set_update_state(true);
    }, [props.nodes, props.edges]);


    useEffect(()=>{
        if(update_state){
            onLayout('TB');
            set_update_state(false);
        }
    }, [update_state])

    const onLayout = useCallback(
        (direction) => {
            const layouted = getLayoutedElements(nodes, edges, { direction });

            setNodes([...layouted.nodes]);
            setEdges([...layouted.edges]);

            fitView();
        },
        [nodes, edges],
    );


    let handle_edge_add = (event) => {
    }

    let handle_node_select = (event, node) => {
        let selected_nodes = props.nodes.filter(flt=> {
            return String(flt.id) === node.id
        })[0];
        if(props.onNodeSelect) props.onNodeSelect(selected_nodes);
    }

    let handle_edge_select = (event, edge) => {
        let node = 0;
        if(props.onNodeSelect) props.onNodeSelect(event, node);
    }

    let handle_node_remove = (node) => {
        let selected_nodes = props.nodes.filter(flt=> {
            return String(flt.id) === node[0].id
        })[0];
        if(props.onNodeSelect) props.onNodeRemove(selected_nodes);
    }

    let handle_edge_remove = (event) => {
        let node = 0;
        if(props.onNodeSelect) props.onNodeSelect(event, node);
    }


    let handle_deselect = () => {
        if(props.onCanvasClick) props.onCanvasClick();
    }

    return(
        <div style={{
            width: '99%',
            height: '82%',
            minHeight: '500px',
            margin:'3px',
            position: 'relative'
        }}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onConnect={handle_edge_add}
                onNodesDelete={handle_node_remove}
                onEdgesDelete={handle_edge_remove}
                onNodeClick={handle_node_select}
                onEdgeClick={handle_edge_select}
                onPaneClick={handle_deselect}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                colorMode="dark"
                fitView
            >
                <Controls />
                <MiniMap />
                <Background variant="dots" gap={12} size={1} />
            </ReactFlow>
        </div>
    );
};


export default NewEmulatorDiagram;
