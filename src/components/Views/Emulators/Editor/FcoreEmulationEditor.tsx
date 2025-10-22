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

import React, {useContext, useEffect, useState} from 'react';
import {useNavigate} from "react-router";
import {ToastContainer, toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import EmulatorDiagram from "./EmulatorDiagram.js";
import {up_emulator_result, download_text, up_emulator} from "#client_core/index.js";
import {SimpleContent, TabbedContent, UIPanel} from "#UI/index.js";
import CoreInputsList from "./CoreInputsList.js";
import CoreOutputsList from "./CoreOutputsList.js";
import CoreMemoriesList from "./CoreMemoriesList.js";
import CoreInputFilesList from "./CoreInputFilesList.js";
import {ApplicationContext} from "#src/AuthApp.jsx";
import type {EmulatorGraphEdge, EmulatorGraphNode, EmulatorIomSelector, EmulatorSelections} from "#interfaces/index.js";

interface FcoreEmulationEditorProps {
    emulator: up_emulator,
    selections: EmulatorSelections,
    on_selection: (selection: EmulatorSelections) => void,
    onInputDataChange: (data: Record<string, Record<string, number[]>>) => void,
    onDeploy: ()=>void,
    input_data: Record<string, number[]>,
    onEmulationDone: (result: up_emulator_result) => void,
}

let FcoreEmulationEditor = function (props: FcoreEmulationEditorProps) {

    const application = useContext(ApplicationContext);

    const [n_cores, set_n_cores] = useState(0);
    const [enabled_actions, set_enabled_actions] = useState({
        add: false,
        edit: false,
        build: false,
        run: false,
        deploy: false,
        hw_sim:true,
        copy:false
    })
    const navigate = useNavigate();


    const [nodes, setNodes] = useState<EmulatorGraphNode[]>([]);
    const [edges, setEdges] = useState<EmulatorGraphEdge[]>([]);

    let [selected_inputs_tab, set_selected_inputs_tab] = useState(0);

    useEffect(() =>{
        if(props.selections.component){
            if(props.selections.component.type === "node"){
                set_enabled_actions({
                    add: enabled_actions.add,
                    edit: true,
                    build: enabled_actions.build,
                    run: enabled_actions.run,
                    deploy: enabled_actions.deploy,
                    hw_sim: enabled_actions.hw_sim,
                    copy:true
                });
                return;
            }
        }
        set_enabled_actions({
            add: enabled_actions.add,
            edit: false,
            build: enabled_actions.build,
            run: enabled_actions.run,
            deploy: enabled_actions.deploy,
            hw_sim: enabled_actions.hw_sim,
            copy: false
        });

    },[props.selections.component])

    useEffect(() => {
        //SETUP NODES
        if(props.emulator.name !== "" ){
            set_enabled_actions({
                add: true,
                edit: false,
                build: true,
                run: true,
                deploy: true,
                hw_sim: true,
                copy: false
            });

            let initial_nodes: EmulatorGraphNode[] = [];
            let n = 0;
            Object.values(props.emulator.cores).map((c)=>{
                n += 1;
                initial_nodes.push({ id: c.id, text: c.name });
            });
            set_n_cores(n);
            setNodes(nodes => (initial_nodes));
            //SETUP EDGES
            let initial_edges: EmulatorGraphEdge[] = [];
            props.emulator.connections.map((c, idx: number)=>{
                initial_edges.push({
                    id:idx,
                    from: c.source_core,
                    to: c.destination_core
                })
            });
            setEdges(edges =>(initial_edges));
            let inputs_obj: Record<string, Record<string, number[]>> ={};

            debugger;
            Object.values(props.emulator.cores).map((core)=>{
                return core.input_data
            }).filter((item)=>{
                return item.length>0;
            }).flat().map((item)=>{
                inputs_obj[item.name] = item.data;
            });
            props.onInputDataChange(inputs_obj);
        }
    }, [props.emulator]);

    useEffect(()=>{

        let new_nodes: EmulatorGraphNode[] = [];
        Object.values(props.emulator.cores).map((c)=>{
            new_nodes.push({ id: c.id, text: c.name });
        });
        setNodes(new_nodes);
    }, [props.selections.obj_version])

    let add_core = async ()=>{
        let core = await props.emulator.add_core();
        setNodes([...nodes, {id:core.id, text:core.name}]);
        set_n_cores(n_cores+1);
    };

    const copy_core = async ()=>{
        if(props.selections.component && props.selections.component.type === "node"){
            let core = await props.emulator.duplicate_core(props.selections.component.obj.id);
            setNodes([...nodes, {id:core.id, text:core.name}]);
            set_n_cores(n_cores+1);
        }
    }

    let handle_node_select = (event: any, node: EmulatorGraphNode) =>{
        props.on_selection({...props.selections, iom:null, component:{type:"node", obj:node}});
    }

    let handle_edge_select = (event: any, edge: EmulatorGraphEdge) =>{
        props.on_selection({...props.selections, iom:null, component:{type:"edge", obj:edge}});
    }

    let handle_run = async () =>{
        let results = await props.emulator.emulator_run();
        if(results.code && results.code === 7) {
        } else if(results.code && results.code === 9){
            toast.warn(results.error);
        } else {
            props.onEmulationDone(new up_emulator_result(JSON.parse(results.results), props.input_data));
            toast.success("Emulation Completed");
        }
    }

    let handle_edit = () => {
        let component = props.selections.component;
        if(component === undefined || component === null) return;
        let core = props.emulator.cores[component.obj.id];
        if(core === undefined || core === null) return;
        navigate("/programs", {state: {selected_program:core.program}});
    }

    let handle_hardware_sim = async () =>{
        let data = await props.emulator.download_hardware_sim_data();
        if(data === undefined) return;
        download_text(data.control, "control_bus.txt");
        download_text(data.code, "code_bus.txt");
        download_text(data.inputs, "input_bus.txt");
    }

    let handle_deploy = async () =>{
        let deploy = true;
        if(application.application_name !== "HIL_base"){
            if(!window.confirm("This feature is only meant to work with the HIL_base application, do you wish to continue regardless:")){
                deploy = false;
            }
        }
        if(deploy){
            let ret = await props.emulator.deploy();
            if(ret.code && ret.code === 8) {
                toast.error(ret.error);
            } else if(ret.code && ret.code === 9){
                toast.warn(ret.error);
            } else {
                props.onDeploy();
                toast.success("HIL correctly deployed");
            }
        }
    }

    let handle_canvas_click = ()=>{
        props.on_selection({...props.selections,...{component:null, iom:null}});
    }

    let handle_link_nodes = (event: any, from: EmulatorGraphNode, to:EmulatorGraphNode) =>{
        debugger;
        if(!props.emulator.deployment_mode){
            let found_edges = props.emulator.connections.filter((conn)=>{
                return conn.source_core === from.id && conn.destination_core === to.id;
            })
            if(found_edges.length === 0){
                props.emulator.add_dma_connection(from.id, to.id).then(()=>{
                    const id = `${from.id}-${to.id}`;
                    setEdges([
                        ...edges,
                        {
                            id:0,
                            from: from.id,
                            to: to.id
                        }
                    ]);
                });
            }
        }

    }

    let handle_node_remove = (result:{nodes:EmulatorGraphNode[],edges:EmulatorGraphEdge[]},node: EmulatorGraphNode)=>{
        props.on_selection({...props.selections,component:null});
        let new_edges: EmulatorGraphEdge[] = [];
        edges.map((item)=> {
            if (item.from !== node.id && item.to !== node.id) {
                new_edges.push(item);
            }
        });
        props.emulator.remove_node_connections(node.id).then(()=>{
            props.emulator.remove_core(node.id).then();
            setNodes(result.nodes);
            setEdges(new_edges);
        });
    }

    let handle_edge_remove = (edge: EmulatorGraphEdge) =>{
        props.on_selection({...props.selections,component:null});
        props.emulator.remove_dma_connection(edge.from, edge.to).then(()=>{
            let n_e = edges.filter((item) =>{ return item.id !== edge.id});
            setEdges(n_e);
        });
    }

    const handle_select_iom = (selection: EmulatorIomSelector)=>{
        let sel = {...props.selections, iom:selection};
        props.on_selection(sel);
    }

    if(props.emulator){
        
        return(
            <div style={{
                display:"flex",
                flexDirection: "column",
                gap:10,
                minWidth:0,
                flexGrow:1
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
                        <SimpleContent name="Emulation_diagram" height="100%">
                            <EmulatorDiagram
                                onNodeSelect={handle_node_select}
                                onNodeRemove={handle_node_remove}
                                onEdgeSelect={handle_edge_select}
                                onEdgeRemove={handle_edge_remove}
                                onCanvasClick={handle_canvas_click}
                                onLinkNodes={handle_link_nodes}
                                onAdd={add_core}
                                onRun={handle_run}
                                onCopy={copy_core}
                                onDeploy={handle_deploy}
                                onHardwareSim={handle_hardware_sim}
                                onEdit={handle_edit}
                                nodes={nodes}
                                edges={edges}
                                enabled_actions={enabled_actions}
                            />
                        </SimpleContent>
                    </UIPanel>
                    <div style={{
                        display:"flex",
                        flexDirection:"row",
                        gap:10,
                        minHeight:"270px"
                    }}>
                        <UIPanel style={{flexGrow:1}} key="emulator_i_props" level="level_2">
                            <TabbedContent names={["Inputs", "Input Files"]} onSelect={set_selected_inputs_tab} selected={selected_inputs_tab}>
                                <CoreInputsList
                                    emulator={props.emulator}
                                    on_selection={handle_select_iom}
                                    selections={props.selections}
                                />
                                <CoreInputFilesList
                                    emulator={props.emulator}
                                    selections={props.selections}
                                />
                            </TabbedContent>
                        </UIPanel>
                        <UIPanel  style={{flexGrow:1}} key="emulator_o_props" level="level_2">
                            <SimpleContent name="Outputs" height="100%" >
                                <CoreOutputsList
                                    emulator={props.emulator}
                                    selections={props.selections}
                                    on_selection={handle_select_iom}
                                />
                            </SimpleContent>
                        </UIPanel>
                        <UIPanel  style={{flexGrow:1}} key="emulator_m_props"  level="level_2">
                            <SimpleContent name="Memory" height="100%" >
                                <CoreMemoriesList
                                    emulator={props.emulator}
                                    selections={props.selections}
                                    on_selection={handle_select_iom}
                                />
                            </SimpleContent>
                        </UIPanel>
                    </div>

            </div>
        );
    } else{
        return <></>
    }
};

export default FcoreEmulationEditor;
