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


    let [version, setVersion] = useState(0);

    useEffect(()=>{

        let relayout_needed = false;
        let new_nodes = [];
        let new_edges = [];
        // Generation of the nodes and edges arrays must be smart to avoid unnecessary re-layouts and deselections
        for(let i=0; i<props.nodes.length; i++){
            if(nodes[i]){
                if(nodes[i].id === String(props.nodes[i].id) && nodes[i].data.label === props.nodes[i].text) {
                    new_nodes.push(nodes[i]);
                    continue;
                }
            }
            new_nodes.push({
                id: String(props.nodes[i].id),
                position: {x: 100, y: i*100+ 20},
                data: {label:props.nodes[i].text}
            })
        }

        setNodes(new_nodes);
        for(let i=0; i<props.edges.length; i++){
            if(edges[i]){
                if(edges[i].source === String(props.edges[i].from) && edges[i].target === String(props.edges[i].to)) {
                    new_edges.push(edges[i]);
                    continue;
                }
            }
            new_edges.push({
                id: String(i),
                source: String(props.edges[i].from),
                target: String(props.edges[i].to),
                animated: true
            })
        }

        if(new_nodes.length !== nodes.length || new_edges.length !== edges.length){
            set_update_state(true);
        } else {
            for(let i=0; i<new_edges.length; i++){
                relayout_needed |= new_edges[i].id !== edges[i].id || new_edges[i].source !== edges[i].source || new_edges[i].target !== edges[i].target;
            }
        }
        setEdges(new_edges);
        setVersion(version+1);
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

    let handle_edge_add = useCallback( (connection) => {
        if(props.onLinkNodes) props.onLinkNodes(parseInt(connection.source), parseInt(connection.target));
    },[props.onLinkNodes])

    let handle_node_select = useCallback((event, node) => {
        let selected_nodes = props.nodes.filter(flt=> {
            return String(flt.id) === node.id
        })[0];
        if(props.onNodeSelect) props.onNodeSelect(selected_nodes);
    },[props.nodes, props.onNodeSelect]);

    let handle_edge_select = useCallback((event, edge) => {
        let selected_edge = props.edges.filter(flt=> {
            return String(flt.to) === edge.target && String(flt.from) === edge.source
        })[0];
        if(props.onEdgeSelect) props.onEdgeSelect(selected_edge);
    }, [props.edges, props.onEdgeSelect])

    let handle_node_remove =  useCallback((node) => {
        let deleted_node = props.nodes.filter(flt=> {
            return String(flt.id) === node[0].id
        })[0];
        let remaining_nodes = props.nodes.filter(flt=> {
            return String(flt.id) !== node[0].id
        });
        if(props.onNodeRemove) props.onNodeRemove(remaining_nodes, deleted_node);
    },[props.nodes, props.onNodeRemove])

    let handle_edge_remove = (edge) => {
        let selected_edge = props.edges.filter(flt=> {
            return String(flt.to) === edge[0].target && String(flt.from) === edge[0].source
        })[0];
        if(props.onEdgeRemove) props.onEdgeRemove(selected_edge);
    }


    let handle_deselect = useCallback(() => {
        if(props.onCanvasClick) props.onCanvasClick();
    }, [props.onCanvasClick])

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
                version={version}
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
