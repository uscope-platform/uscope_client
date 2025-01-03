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

import EmulatorDiagram from "./EmulatorDiagram";
import {up_emulator_result} from "../../../../client_core";
import {SimpleContent, TabbedContent, UIPanel} from "../../../UI_elements";
import CoreInputsList from "./CoreInputsList";
import CoreOutputsList from "./CoreOutputsList";
import CoreMemoriesList from "./CoreMemoriesList";
import CoreInputFilesList from "./CoreInputFilesList";
import {ApplicationContext} from "../../../../AuthApp";


let FcoreEmulationEditor = function (props) {

    const application = useContext(ApplicationContext);

    const [n_cores, set_n_cores] = useState(0);
    const [enabled_actions, set_enabled_actions] = useState({
        add: false,
        edit: false,
        build: false,
        run: false,
        deploy: false,
        debug:false
    })
    const navigate = useNavigate();


    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);

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
                    debug: enabled_actions.debug
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
            debug: enabled_actions.debug
        });

    },[props.selections.component])

    useEffect(() => {
        //SETUP NODES
        if(props.emulator.name !== ""){
            set_enabled_actions({
                add: true,
                edit: false,
                build: true,
                run: true,
                deploy: true,
                debug: true

            });

            let initial_nodes = [];
            let n = 0;
            Object.values(props.emulator.cores).map((c)=>{
                n += 1;
                initial_nodes.push({ id: c.id, text: c.name });
            });
            set_n_cores(n);
            setNodes(nodes => (initial_nodes));
            //SETUP EDGES
            let initial_edges = [];
            Object.values(props.emulator.connections).map((c)=>{
                const id = `${c.source}-${c.destination}`;
                initial_edges.push({
                    id,
                    from: c.source,
                    to: c.destination
                })
            });
            setEdges(edges =>(initial_edges));
            let inputs_obj ={};

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

    let add_core = ()=>{
        props.emulator.add_core(n_cores+1).then((core)=>{
            setNodes([...nodes, {id:core.id, text:core.name}]);
        });
        set_n_cores(n_cores+1);
    };

    let handle_node_select = (event, node) =>{
        props.on_selection({...props.selections, iom:null, component:{type:"node", obj:node}});
    }

    let handle_edge_select = (event, edge) =>{
        props.on_selection({...props.selections, iom:null, component:{type:"edge", obj:edge}});
    }

    let handle_build = () =>{
        props.on_selection({...props.selections, tab:4});
    }

    let handle_run = async () =>{
        let results = await props.emulator.emulator_run();
        if(results.code && results.code === 7) {
            props.on_compile_done(null);
            toast.error(results.results);
        } else if(results.code && results.code === 9){
            props.on_compile_done(JSON.parse(results.duplicates));
            toast.warn(results.error);
        } else {
            props.on_compile_done(null);
            props.onEmulationDone(new up_emulator_result(JSON.parse(results.results), props.input_data));
            toast.success("Emulation Completed");
        }
    }

    let handle_edit = () => {
        navigate("/programs", {state: {selected_program:props.emulator.cores[props.selections.component.obj.id].program}});
    }

    let handle_debug = async () =>{
        let asm = await props.emulator.disassemble();
        props.on_debug(asm);
        await  props.emulator.debug_init();
        props.on_selection({...props.selections, tab:1});
    }

    let handle_deploy = () =>{
        let deploy = true;
        if(application.application_name !== "HIL_base"){
            if(!window.confirm("This feature is only meant to work with the HIL_base application, do you wish to continue regardless:")){
                deploy = false;
            }
        }
        if(deploy){
            props.emulator.deploy().then((ret)=>{
                if(ret.code && ret.code === 8) {
                    toast.error(ret.error);
                    props.on_compile_done(null);
                } else if(ret.code && ret.code === 9){
                    props.on_compile_done("test");
                    toast.warn(ret.error);
                } else {
                    props.on_compile_done(null);
                    props.onDeploy();
                    toast.success("HIL correctly deployed");
                }
            });
        }
    }

    let handle_canvas_click = ()=>{
        props.on_selection({...props.selections,component:null});
    }

    let handle_link_nodes = (event, from, to) =>{
        if(!props.emulator.deployment_mode){
            let found_edges = props.emulator.connections.filter((conn)=>{
                return conn.source === from.id && conn.destination === to.id;
            })
            if(found_edges.length === 0){
                props.emulator.add_dma_connection(from.id, to.id).then(()=>{
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

    }

    let handle_node_remove = (result, node)=>{
        props.on_selection({...props.selections,component:null});
        let new_edges = [];
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

    let handle_edge_remove = (edge) =>{
        props.on_selection({...props.selections,component:null});
        props.emulator.remove_dma_connection(edge.from, edge.to).then(()=>{
            let n_e = edges.filter((item) =>{ return item.id !== edge.id});
            setEdges(n_e);
        });
    }

    const handle_select_iom = (selection)=>{
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
                                onEdit={handle_edit}
                                onDebug={handle_debug}
                                nodes={nodes}
                                edges={edges}
                                enabled_actions={enabled_actions}
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
                                    emulator={props.emulator}
                                    selected_component={props.selections.component}
                                    on_selection={handle_select_iom}
                                    selected_iom={props.selections.iom}
                                />,
                                <CoreInputFilesList
                                    emulator={props.emulator}
                                    selected_component={props.selections.component}
                                />
                            ]} onSelect={set_selected_inputs_tab} selected={selected_inputs_tab}/>
                        </UIPanel>
                        <UIPanel  style={{flexGrow:1}} key="emulator_o_props" level="level_2">
                            <SimpleContent name="Outputs" height="100%" content={
                                <CoreOutputsList
                                    emulator={props.emulator}
                                    selected_component={props.selections.component}
                                    on_selection={handle_select_iom}
                                    selected_iom={props.selections.iom}
                                />
                            }/>
                        </UIPanel>
                        <UIPanel  style={{flexGrow:1}} key="emulator_m_props"  level="level_2">
                            <SimpleContent name="Memory" height="100%" content={
                                <CoreMemoriesList
                                    emulator={props.emulator}
                                    selected_component={props.selections.component}
                                    on_selection={handle_select_iom}
                                    selected_iom={props.selections.iom}
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
