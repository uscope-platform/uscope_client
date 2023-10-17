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

import React, {useCallback, useReducer, useRef} from 'react';

import {UIPanel, SimpleContent} from "../UI_elements";

import {Responsive, WidthProvider} from "react-grid-layout";

const ResponsiveGridLayout = WidthProvider(Responsive);

import ReactFlow, { useNodesState, useEdgesState, addEdge, updateEdge, useReactFlow }  from 'reactflow';
import 'reactflow/dist/style.css';
import EmulatorToolbar from "../Sidebar/FcoreEmulator/EmulatorToolbar";
import ELK from 'elkjs/lib/elk.bundled'


const elk = new ELK();

const useLayoutedElements = () => {
    const { getNodes, setNodes, getEdges, fitView } = useReactFlow();
    const defaultOptions = {
        'elk.algorithm': 'layered',
        'elk.layered.spacing.nodeNodeBetweenLayers': 100,
        'elk.spacing.nodeNode': 80,
    };

    const getLayoutedElements = useCallback((options) => {
        const layoutOptions = { ...defaultOptions, ...options };
        const graph = {
            id: 'root',
            layoutOptions: layoutOptions,
            children: getNodes(),
            edges: getEdges(),
        };

        elk.layout(graph).then(({ children }) => {
            // By mutating the children in-place we saves ourselves from creating a
            // needless copy of the nodes array.
            children.forEach((node) => {
                node.position = { x: node.x, y: node.y };
            });

            setNodes(children);
            window.requestAnimationFrame(() => {
                fitView();
            });
        });
    }, []);

    return { getLayoutedElements };
};

const initialNodes = [
    { id: '1', position: { x: 0, y: 0 }, data: { label: '1' } },
    { id: '2', position: { x: 0, y: 100 }, data: { label: '2' } },
];
const initialEdges = [{ id: 'e1-2', source: '1', target: '2' , type:"smoothstep"}];


let FcoreEmulationEditor = function (props) {

    const edgeUpdateSuccessful = useRef(true);

    const [n_cores, forceUpdate] = useReducer(x => x + 1, 2);

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    // ADD EDGE CONNECTIONS
    const onConnect = useCallback(
        (params) => setEdges((eds) => addEdge({...params, type:"smoothstep"}, eds)),
        [setEdges]
    );

    // EDIT EDGE CONNECTIONS
    const onEdgeUpdateStart = useCallback(() => {
        edgeUpdateSuccessful.current = false;
    }, []);
    const onEdgeUpdate = useCallback((oldEdge, newConnection) => {
        edgeUpdateSuccessful.current = true;
        setEdges((els) => updateEdge(oldEdge, newConnection, els));
    }, []);
    const onEdgeUpdateEnd = useCallback((_, edge) => {
        if (!edgeUpdateSuccessful.current) {
            setEdges((eds) => eds.filter((e) => e.id !== edge.id));
        }
        edgeUpdateSuccessful.current = true;
    }, []);


    const { getLayoutedElements } = useLayoutedElements();

    let add_core = ()=>{
        setNodes([{ id: n_cores.toString(), position: { x: 0, y: 100*n_cores }, data: { label: n_cores.toString() } }, ...nodes])
        forceUpdate();
    };

    let redo_layout = () =>{
        getLayoutedElements({'elk.algorithm': 'org.eclipse.elk.force'});
    }

    return(
        <ResponsiveGridLayout
            className="layout"
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
            cols={{ lg: 24, md: 20, sm: 12, xs: 8, xxs: 4 }}
            rowHeight={30}
            useCSSTransforms={false}
        >
            <UIPanel key="ch_selector" data-grid={{x: 0, y: 0, w: 20, h: 20, static: true}} level="level_2">
                <SimpleContent name="Emulation setup" content={
                    <div>
                        <EmulatorToolbar
                            onAdd={add_core}
                            onLayout={redo_layout}
                        />
                        <div style={{ width: '100vw', height: '100vh' }}>

                                <ReactFlow
                                    nodes={nodes}
                                    edges={edges}
                                    onNodesChange={onNodesChange}
                                    onEdgesChange={onEdgesChange}
                                    onConnect={onConnect}
                                    onEdgeUpdate={onEdgeUpdate}
                                    onEdgeUpdateStart={onEdgeUpdateStart}
                                    onEdgeUpdateEnd={onEdgeUpdateEnd}
                                    fitView
                                />
                        </div>
                    </div>

                }/>
            </UIPanel>
        </ResponsiveGridLayout>
    );
};




export default FcoreEmulationEditor;
