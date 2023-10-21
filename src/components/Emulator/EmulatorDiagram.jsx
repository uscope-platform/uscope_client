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

import React, {useState} from 'react';

import {UIPanel, SimpleContent} from "../UI_elements";

import {Responsive, WidthProvider} from "react-grid-layout";

const ResponsiveGridLayout = WidthProvider(Responsive);
import 'reactflow/dist/style.css';
import EmulatorToolbar from "./EmulatorToolbar";
import {Canvas, Edge, hasLink, Node, useSelection} from "reaflow";

let EmulatorDiagram = function (props) {

    const inner_nodes = props.nodes;
    const inner_edges = props.edges;


    const selected_node_style = {stroke:"rgb(241,119,63)"}
    const unselected_node_style = {stroke:"rgb(43,44,62)"}


    let { selections, onCanvasClick, onClick, onKeyDown, clearSelections } = useSelection({
        inner_nodes,
        inner_edges,
        onDataChange: (n, e) => {
            console.info('Data changed', n, e);
            props.setNodes(n);
            props.setEdges(e);
        },
        onSelection: (s) => {
            console.info('Selection', s);
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

    let handle_canvas_click = (event) => {
        props.onCanvasClick();
        onCanvasClick();
    };

    let handle_layout_change = (layout) => {
        //console.log('Layout', layout);
    }

    let handle_link_check = (event, from, to) => {
        return !hasLink(props.edges, from, to);
    };

    let handle_link_create = (event, from, to) => {
       props.onLinkNodes(event, from,to);
    };

    return(
        <ResponsiveGridLayout
            className="layout"
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
            cols={{ lg: 24, md: 20, sm: 12, xs: 8, xxs: 4 }}
            rowHeight={30}
            useCSSTransforms={false}
        >
            <UIPanel key="ch_selector" data-grid={{x: 0, y: 0, w: 20, h: 20, static: true}} level="level_2">
                <SimpleContent name="Emulation setup" height="100%" content={
                    <div style={{
                        height:"100%",
                        display:"flex",
                        flexDirection:"column"
                    }}>
                        <EmulatorToolbar onAdd={props.onAdd}/>
                        <Canvas
                            nodes={props.nodes}
                            edges={props.edges}
                            selections={selections}
                            node={<Node onClick={handle_node_click}/>}
                            edge={ <Edge onClick={handle_edge_click}/> }
                            onCanvasClick={handle_canvas_click}
                            onLayoutChange={handle_layout_change}
                            onNodeLinkCheck={handle_link_check}
                            onNodeLink={handle_link_create}
                        />
                    </div>

                }/>
            </UIPanel>
        </ResponsiveGridLayout>
    );
};




export default EmulatorDiagram;
