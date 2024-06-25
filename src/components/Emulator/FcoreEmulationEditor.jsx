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
import CoreInputFilesList from "./CoreInputFilesList";

import {ToastContainer, toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


let FcoreEmulationEditor = function (props) {


    const emulators_store = useSelector(state => state.emulators);
    const applications_store = useSelector(state => state.applications);
    const settings = useSelector(state => state.settings);

    const [n_cores, set_n_cores] = useState(0);

    const dispatch = useDispatch();

    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);

    let [selected_inputs_tab, set_selected_inputs_tab] = useState(0);

    let emulator = props.emulator_selector ? new up_emulator(emulators_store[props.emulator_selector]) : {
        name:"",
        cores:[],
        connections:[],
        _get_emulator: ()=>{
            return{
                name:"",
                cores:[],
                connections:[]
            }
        }
    };

    useEffect(() => {
        //SETUP NODES
        if(emulator){
            let initial_nodes = [];
            let n = 0;
            Object.values(emulator.cores).map((c)=>{
                n += 1;
                initial_nodes.push({ id: c.id, text: c.name });
            });
            set_n_cores(n);
            setNodes(nodes => (initial_nodes));
            //SETUP EDGES
            let initial_edges = [];
            Object.values(emulator.connections).map((c)=>{
                const id = `${c.source}-${c.target}`;
                initial_edges.push({
                    id,
                    from: c.source,
                    to: c.target
                })
            });
            setEdges(edges =>(initial_edges));
            let inputs_obj ={};

            Object.values(emulator.cores).map((core)=>{
                return core.input_data
            }).filter((item)=>{
                return item.length>0;
            }).flat().map((item)=>{
                inputs_obj[item.name] = item.data;
            });
            props.onInputDataChange(inputs_obj);
        }
    }, [props.emulator_selector]);

    let add_core = ()=>{
        emulator.add_core(n_cores+1).then((core)=>{
            setNodes([...nodes, {id:core.id, text:core.name}]);
        });
        set_n_cores(n_cores+1);
    };

    let handle_node_select = (event, node) =>{
        props.on_component_select({type:"node", obj:node});
    }

    let handle_edge_select = (event, edge) =>{
        props.on_component_select({type:"edge", obj:edge});
    }

    let handle_build = (args) =>{
        let product = emulator.build();
        download_json(product, s_e.name + "_artifact");
    }

    let handle_run = (args) =>{
        emulator.run().then((results)=>{
            if(results.code && results.code === 7) {
                dispatch(setSetting(["emulator_compile_warning", null]));
                toast.error(results.error);
            } else if(results.code && results.code === 9){
                dispatch(setSetting(["emulator_compile_warning", JSON.parse(results.duplicates)['duplicates']]));
                toast.warn(results.error);
            } else {
                dispatch(setSetting(["emulator_compile_warning", null]));
                props.onEmulationDone(results);
                toast.success("Emulation Completed");
            }
        });
    }

    let handle_deploy = () =>{
        let deploy = true;
        if(applications_store[settings.application].application_name !== "HIL_base"){
            if(!window.confirm("This feature is only meant to work with the HIL_base application, do you wish to continue regardless:")){
                deploy = false;
            }
        }
        if(deploy){
            emulator.deploy().then((ret)=>{
                if(ret.code && ret.code === 8) {
                    toast.error(ret.error);
                    dispatch(setSetting(["emulator_compile_warning", null]));
                } else if(ret.code && ret.code === 9){
                    dispatch(setSetting(["emulator_compile_warning", "test"]));
                    toast.warn(ret.error);
                } else {
                    dispatch(setSetting(["emulator_compile_warning", null]));
                    props.onDeploy();
                    toast.success("HIL correctly deployed");
                }
            });
        }
    }

    let handle_canvas_click = ()=>{
        props.on_component_select(null);
    }


    let handle_link_nodes = (event, from, to) =>{

        let found_edges = emulator.connections.filter((conn)=>{
            return conn.source === from.id && conn.target === to.id;
        })
        if(found_edges.length === 0){
            emulator.add_dma_connection(from.id, to.id).then(()=>{
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
        props.on_component_select(null);
        let new_edges = [];
        edges.map((item)=> {
            if (item.from !== node.id && item.to !== node.id) {
                new_edges.push(item);
            }
        });
        emulator.remove_node_connections(node.id).then(()=>{
            emulator.remove_core(node.id).then();
            setNodes(result.nodes);
            setEdges(new_edges);
        });
    }

    let handle_edge_remove = (edge) =>{
        props.on_component_select(null);
        props.emulator.remove_dma_connection(edge.from, edge.to).then(()=>{
            let n_e = edges.filter((item) =>{ return item.id !== edge.id});
            setEdges(n_e);
        });
    }

    if(emulator){
        
        return(
            <div style={{
                display:"flex",
                flexDirection: "column",
                gap:10,
                margin:10
            }}>
                <ToastContainer
                    position="top-right"
                    autoClose={2000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="dark"
                />
                    <UIPanel key="emulator_diagram" level="level_2">
                        <SimpleContent name="Emulation_diagram" height="100%" content={
                            <EmulatorDiagram
                                selected_node={props.selected_component}
                                onNodeSelect={handle_node_select}
                                onNodeRemove={handle_node_remove}
                                onEdgeSelect={handle_edge_select}
                                onEdgeRemove={handle_edge_remove}
                                onCanvasClick={handle_canvas_click}
                                onLinkNodes={handle_link_nodes}
                                onAdd={add_core}
                                onBuild={handle_build}
                                onRun={handle_run}
                                onDeploy={handle_deploy}
                                nodes={nodes}
                                edges={edges}
                            />
                        }/>
                    </UIPanel>
                    <div style={{
                        display:"flex",
                        flexDirection:"row",
                        gap:10,
                        minHeight:"270px"
                    }}>
                        <UIPanel style={{flexGrow:1}} key="emulator_i_props" level="level_2">
                            <TabbedContent names={["Inputs", "Input Files"]} contents={[
                                <CoreInputsList
                                    emulator={emulator}
                                    selected_component={props.selected_component}
                                    on_iom_select={props.on_iom_select}
                                    selected_iom={props.selected_iom}
                                />,
                                <CoreInputFilesList
                                    emulator={emulator}
                                    selected_component={props.selected_component}
                                />
                            ]} onSelect={set_selected_inputs_tab} selected={selected_inputs_tab}/>
                        </UIPanel>
                        <UIPanel  style={{flexGrow:1}} key="emulator_o_props" level="level_2">
                            <SimpleContent name="Outputs" height="100%" content={
                                <CoreOutputsList
                                    emulator={emulator}
                                    selected_component={props.selected_component}
                                    on_iom_select={props.on_iom_select}
                                    selected_iom={props.selected_iom}
                                />
                            }/>
                        </UIPanel>
                        <UIPanel  style={{flexGrow:1}} key="emulator_m_props"  level="level_2">
                            <SimpleContent name="Memory" height="100%" content={
                                <CoreMemoriesList
                                    emulator={emulator}
                                    selected_component={props.selected_component}
                                    on_iom_select={props.on_iom_select}
                                    selected_iom={props.selected_iom}
                                />
                            }/>
                        </UIPanel>
                    </div>

            </div>
        );
    } else{
        return <></>
    }
};

export default FcoreEmulationEditor;
