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

import React, {useEffect, useState} from 'react';

import EmulatorDiagram from "./EmulatorDiagram";
import {useDispatch, useSelector} from "react-redux";
import {setSetting} from "../../redux/Actions/SettingsActions";
import {download_json, up_emulator} from "../../client_core";
import {SimpleContent, TabbedContent, UIPanel} from "../UI_elements";
import CoreInputsList from "./CoreInputsList";
import CoreOutputsList from "./CoreOutputsList";
import CoreMemoriesList from "./CoreMemoriesList";
import {Responsive, WidthProvider} from "react-grid-layout";
import CoreInputFilesList from "./CoreInputFilesList";


const ResponsiveGridLayout = WidthProvider(Responsive);

let FcoreEmulationEditor = function (props) {


    const emulators = useSelector(state => state.emulators);
    const settings = useSelector(state => state.settings);

    const selected_emulator = emulators[settings.selected_emulator]

    const [n_cores, set_n_cores] = useState(0);

    const dispatch = useDispatch();

    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);

    let [selectedTab, set_selectedTab] = useState(0);

    useEffect(() => {
        //SETUP NODES
        if(selected_emulator){
            let initial_nodes = [];
            let n = 0;
            Object.values(selected_emulator.cores).map((c)=>{
                n += 1;
                initial_nodes.push({ id: c.id, text: c.name });
            });
            set_n_cores(n);
            setNodes(nodes => (initial_nodes));
            //SETUP EDGES
            let initial_edges = [];
            Object.values(selected_emulator.connections).map((c)=>{
                const id = `${c.source}-${c.target}`;
                initial_edges.push({
                    id,
                    from: c.source,
                    to: c.target
                })
            });
            setEdges(edges =>(initial_edges));
        }
    }, [settings.selected_emulator]);

    let add_core = ()=>{
        let s_e = new up_emulator(selected_emulator);
        s_e.add_core(n_cores+1).then((core)=>{
            setNodes([...nodes, {id:core.id, text:core.name}]);

        });
        set_n_cores(n_cores+1);
    };

    let handle_node_select = (event, node) =>{
        dispatch(setSetting(["emulator_selected_iom", null]));
        dispatch(setSetting(["emulator_selected_component", {type:"node", obj:node}]));
    }

    let handle_edge_select = (event, edge) =>{
        dispatch(setSetting(["emulator_selected_iom", null]));
        dispatch(setSetting(["emulator_selected_component", {type:"edge", obj:edge}]))
    }

    let handle_build = (args) =>{
        let s_e = new up_emulator(selected_emulator);
        let product = s_e.build();
        download_json(product, s_e.name + "_artifact");
    }


    let handle_canvas_click = ()=>{
        dispatch(setSetting(["emulator_selected_component", null]));
    }


    let handle_link_nodes = (event, from, to) =>{

        let s_e = new up_emulator(selected_emulator);
        let found_edges = s_e.connections.filter((conn)=>{
            return conn.source === from.id && conn.target === to.id;
        })
        if(found_edges.length === 0){
            s_e.add_dma_connection(from.id, to.id).then(()=>{
                const id = `${from.id}-${to.id}`;
                setEdges([
                    ...edges,
                    {
                        id,
                        from: from.id,
                        to: to.id
                    }
                ]);
            });
        }
    }

    let handle_node_remove = (result, node)=>{
        let s_e = new up_emulator(selected_emulator);
        dispatch(setSetting(["emulator_selected_iom", null]));
        dispatch(setSetting(["emulator_selected_component", null]));
        let new_edges = [];
        edges.map((item)=> {
            if (item.from !== node.id && item.to !== node.id) {
                new_edges.push(item);
            }
        });
        s_e.remove_node_connections(node.id).then(()=>{
            s_e.remove_core(node.id).then();
            setNodes(result.nodes);
            setEdges(new_edges);
        });
    }

    let handle_edge_remove = (edge) =>{
        let s_e = new up_emulator(selected_emulator);
        dispatch(setSetting(["emulator_selected_iom", null]));
        dispatch(setSetting(["emulator_selected_component", null]));
        s_e.remove_dma_connection(edge.from, edge.to).then(()=>{
            let n_e = edges.filter((item) =>{ return item.id !== edge.id});
            setEdges(n_e);
        });
    }

    if(selected_emulator){
        
        return(
            <ResponsiveGridLayout
                className="layout"
                breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                cols={{ lg: 24, md: 20, sm: 12, xs: 8, xxs: 4 }}
                rowHeight={30}
                useCSSTransforms={false}
            >
                <UIPanel key="emulator_diagram" data-grid={{x: 0, y: 0, w: 24, h: 18, static: true}} level="level_2">
                    <SimpleContent name="Emulation setup" height="100%" content={
                        <EmulatorDiagram
                            selected_node={settings.emulator_selected_component}
                            onNodeSelect={handle_node_select}
                            onNodeRemove={handle_node_remove}
                            onEdgeSelect={handle_edge_select}
                            onEdgeRemove={handle_edge_remove}
                            onCanvasClick={handle_canvas_click}
                            onLinkNodes={handle_link_nodes}
                            onAdd={add_core}
                            onBuild={handle_build}
                            nodes={nodes}
                            edges={edges}
                        />
                    }/>
                </UIPanel>
                <UIPanel key="emulator_i_props" data-grid={{x: 0, y: 18, w: 8, h: 7.4, static: true}} level="level_2">
                    <TabbedContent names={["Inputs", "Input Files"]} contents={[
                        <CoreInputsList/>,
                        <CoreInputFilesList/>
                    ]} onSelect={set_selectedTab} selected={selectedTab}/>
                </UIPanel>
                <UIPanel key="emulator_o_props" data-grid={{x: 8, y: 18, w: 8, h: 7.4, static: true}} level="level_2">
                    <SimpleContent name="Outputs" height="100%" content={
                        <CoreOutputsList/>
                    }/>
                </UIPanel>
                <UIPanel key="emulator_m_props" data-grid={{x: 16, y: 18, w: 8, h: 7.4, static: true}} level="level_2">
                    <SimpleContent name="Memory" height="100%" content={
                        <CoreMemoriesList/>
                    }/>
                </UIPanel>
            </ResponsiveGridLayout>
        );
    } else{
        return <></>
    }
};

export default FcoreEmulationEditor;
