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
import {toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import EmulatorDiagram from "./EmulatorDiagram.js";
import type {BlockKind} from "./EmulatorLibrary.js";
import {up_emulator_result, download_text, up_emulator} from "#client_core/index.js";
import {SimpleContent, PaneGroup, TabbedContent, UIPanel} from "#UI/index.js";
import CoreIoPanel from "./CoreIoPanel.js";
import {ApplicationContext} from "#src/ApplicationContext.js";
import type {io_block, emulator_layout, EmulatorGraphEdge, EmulatorGraphNode, EmulatorIomSelector, EmulatorSelections} from "#interfaces/index.js";

interface FcoreEmulationEditorProps {
    emulator: up_emulator,
    selections: EmulatorSelections,
    on_selection: (selection: EmulatorSelections) => void,
    onInputDataChange: (data: Record<string, Record<string, number[]>>) => void,
    onDeploy: ()=>void,
    input_data: Record<string, number[]>,
    onEmulationDone: (result: up_emulator_result) => void,
    bump_version: () => void,
}

/// The edges of the diagram, one per connection: the id is the position of the connection, so that they are all different
const edges_of = (emulator: up_emulator): EmulatorGraphEdge[] =>{
    return emulator.connections.map((c, idx: number) => ({id: idx, from: c.source_core, to: c.destination_core}));
};

const io_node_of = (b: io_block): EmulatorGraphNode =>({
    id: b.id,
    text: b.name,
    kind: "io",
    direction: b.direction
});

/// The nodes of the diagram: the cores and the IO blocks, that share the ids
const nodes_of = (emulator: up_emulator): EmulatorGraphNode[] =>{
    return [
        ...Object.values(emulator.cores).map((c): EmulatorGraphNode => ({id: c.id, text: c.name, kind: "core"})),
        ...Object.values(emulator.io_blocks).map((b): EmulatorGraphNode => io_node_of(b))
    ];
};

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
        copy:false,
        delete: false
    })
    const navigate = useNavigate();


    const [nodes, setNodes] = useState<EmulatorGraphNode[]>([]);
    const [edges, setEdges] = useState<EmulatorGraphEdge[]>([]);

    let [selected_inputs_tab, set_selected_inputs_tab] = useState(0);

    useEffect(() =>{
        let allow_delete = props.selections.component !== null &&
            (props.selections.component.type === "node" || props.selections.component.type === "edge");
        if(props.selections.component){
            if(props.selections.component.type === "node"){
                // an IO block has neither a program nor a copy
                const is_core = !props.emulator.is_io_block(props.selections.component.obj.id);
                set_enabled_actions({
                    add: enabled_actions.add,
                    edit: is_core,
                    build: enabled_actions.build,
                    run: enabled_actions.run,
                    deploy: enabled_actions.deploy,
                    hw_sim: enabled_actions.hw_sim,
                    copy: is_core,
                    delete: allow_delete
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
            copy: false,
            delete: allow_delete
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
                copy: false,
                delete: false
            });

            set_n_cores(Object.keys(props.emulator.cores).length);
            setNodes(nodes_of(props.emulator));
            //SETUP EDGES
            setEdges(edges_of(props.emulator));
            let inputs_obj: Record<string, Record<string, number[]>> ={};

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

        setNodes(nodes_of(props.emulator));
    }, [props.selections.obj_version])

    const add_block = async (kind: BlockKind, position: {x: number, y: number})=>{
        if(kind === "core"){
            let core = await props.emulator.add_core();
            await props.emulator.set_node_positions({[core.id]: position});
            setNodes([...nodes, {id:core.id, text:core.name, kind:"core"}]);
            set_n_cores(n_cores+1);
        } else {
            let block = await props.emulator.add_io_block(kind);
            await props.emulator.set_node_positions({[block.id]: position});
            setNodes([...nodes, io_node_of(block)]);
        }
    };

    const move_nodes = (positions: emulator_layout)=>{
        props.emulator.set_node_positions(positions).then();
    };

    const copy_core = async ()=>{
        if(props.selections.component && props.selections.component.type === "node"){
            const original = props.selections.component.obj.id;
            let core = await props.emulator.duplicate_core(original);
            // next to the original
            const at = props.emulator.layout[original];
            if(at) await props.emulator.set_node_positions({[core.id]: {x: at.x + 30, y: at.y + 30}});
            setNodes([...nodes, {id:core.id, text:core.name, kind:"core"}]);
            set_n_cores(n_cores+1);
        }
    }

    const rename_node = async (id: number, name: string) =>{
        if(props.emulator.is_io_block(id)){
            await props.emulator.edit_io_block_props(id, "name", name);
        } else {
            await props.emulator.edit_core_props(id, "name", name);
        }
        setNodes((current) => current.map((node) => node.id === id ? {...node, text: name} : node));
        props.bump_version();
    }

    let handle_node_select = (event: unknown, node: EmulatorGraphNode) =>{
        props.on_selection({...props.selections, iom:null, component:{type:"node", obj:node}});
    }

    let handle_edge_select = (event: unknown, edge: EmulatorGraphEdge) =>{
        props.on_selection({...props.selections, iom:null, component:{type:"edge", obj:edge}});
    }

    /// The build would throw on the same errors: they are shown here, one per line, instead
    const io_types_ok = () =>{
        const errors = props.emulator.check_io_types();
        errors.forEach((e) => toast.error(e));
        return errors.length === 0;
    }

    let handle_run = async () =>{
        if(!io_types_ok()) return;
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

    let delete_selection = ()=>{

        let selection = props.selections.component;
        if(selection==null)return;
        if(selection.type === "node"){
            let selected_node = selection.obj.id
            props.on_selection({...props.selections,component:null});
            if(props.emulator.is_io_block(selected_node)){
                props.emulator.remove_io_block(selected_node).then(()=>{
                    setNodes(nodes.filter((item)=> item.id !== selected_node));
                    setEdges(edges_of(props.emulator));
                });
                return;
            }
            props.emulator.remove_node_connections(selected_node).then(()=>{
                props.emulator.remove_core(selected_node).then();
                setNodes(nodes.filter((item)=> item.id !== selected_node));
                setEdges(edges_of(props.emulator));
            });
        } else if (selection.type === "edge"){
            let edge = edges.filter((item)=> item.id === selection.obj.id)[0];
            if(edge == undefined)return;
            props.on_selection({...props.selections,component:null});
            props.emulator.remove_dma_connection(edge.from, edge.to).then(()=>{
                setEdges(edges_of(props.emulator));
            });
        }

    }

    let handle_hardware_sim = async () =>{
        if(!io_types_ok()) return;
        let data = await props.emulator.download_hardware_sim_data();
        if(data === undefined) return;
        download_text(data.control, "control_bus.txt");
        download_text(data.code, "code_bus.txt");
        download_text(data.inputs, "input_bus.txt");
    }

    let handle_deploy = async () =>{
        if(!io_types_ok()) return;
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

    let handle_link_nodes = (event: unknown, from: EmulatorGraphNode, to:EmulatorGraphNode) =>{
        if(!props.emulator.deployment_mode && props.emulator.can_connect(from.id, to.id)){
            let found_edges = props.emulator.connections.filter((conn)=>{
                return conn.source_core === from.id && conn.destination_core === to.id;
            })
            if(found_edges.length === 0){
                props.emulator.add_dma_connection(from.id, to.id).then(()=>{
                    setEdges(edges_of(props.emulator));
                });
            }
        }

    }

    const handle_select_iom = (selection: EmulatorIomSelector)=>{
        let sel = {...props.selections, iom:selection};
        props.on_selection(sel);
    }

    if(props.emulator){
        
        return(
            <PaneGroup id="emulator_editor" orientation="vertical" style={{paddingTop: "10px", boxSizing: "border-box"}}>
                <UIPanel id="diagram" key="emulator_diagram" level="level_2" default_size={65} min_size={20}>
                    <SimpleContent name="Emulation_diagram" height="100%">
                        <EmulatorDiagram
                            onNodeSelect={handle_node_select}
                            onEdgeSelect={handle_edge_select}
                            onCanvasClick={handle_canvas_click}
                            onLinkNodes={handle_link_nodes}
                            onAddBlock={add_block}
                            onMoveNodes={move_nodes}
                            layout={props.emulator.layout}
                            view_key={props.emulator.id}
                            selection={props.selections.component}
                            can_link={props.emulator.can_connect}
                            onDelete={delete_selection}
                            onRename={rename_node}
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
                <UIPanel id="core_io" key="emulator_core_io" level="level_2" default_size={35} min_size="150px">
                    <CoreIoPanel
                        emulator={props.emulator}
                        selections={props.selections}
                        on_selection={handle_select_iom}
                        selected_tab={selected_inputs_tab}
                        on_tab_select={set_selected_inputs_tab}
                    />
                </UIPanel>
            </PaneGroup>
        );
    } else{
        return <></>
    }
};

export default FcoreEmulationEditor;
