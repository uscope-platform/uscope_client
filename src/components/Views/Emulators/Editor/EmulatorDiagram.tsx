/*
 * Copyright(c) 2025. Filippo Savi
 * Author: Filippo Savi <filssavi@gmail.com>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */

import {useEffect, useRef, useState} from "react";
import {css} from "goober";
import {
    Background,
    BackgroundVariant,
    Controls,
    Handle,
    MarkerType,
    Position,
    ReactFlow,
    ReactFlowProvider,
    useEdgesState,
    useNodesState,
    useReactFlow
} from "@xyflow/react";
import type {Connection, Edge, Node, NodeProps} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {ColorTheme, ConfirmDialog, ContextMenu, confirm_delete_enabled, set_confirm_delete} from "#UI/index.js";
import type {ContextMenuAction} from "#UI/index.js";
import EmulatorToolbar from "./EmulatorToolbar.jsx";
import EmulatorLibrary, {BLOCK_DRAG_TYPE} from "./EmulatorLibrary.jsx";
import type {BlockKind} from "./EmulatorLibrary.jsx";
import {io_colors} from "./io_colors.js";
import {auto_layout, NODE_HEIGHT, NODE_WIDTH} from "./auto_layout.js";
import type {
    EmulatorComponentSelector,
    EmulatorGraphEdge,
    EmulatorGraphNode,
    emulator_layout
} from "#interfaces/index.js";

interface EmulatorDiagramProps {
    nodes: EmulatorGraphNode[];
    edges: EmulatorGraphEdge[];
    // where the nodes were left, the ones missing from it are placed by the diagram
    layout: emulator_layout;
    // the diagram is fitted again when it changes: the emulator that is shown
    view_key: number;
    selection: EmulatorComponentSelector | null;
    onNodeSelect: (event: unknown, node: EmulatorGraphNode) => void;
    onEdgeSelect: (event: unknown, edge: EmulatorGraphEdge) => void;
    onCanvasClick: () => void;
    onAddBlock: (kind: BlockKind, position: {x: number, y: number}) => void;
    onMoveNodes: (positions: emulator_layout) => void;
    onRun: () => void;
    onDeploy: () => void;
    onDelete: () => void;
    onHardwareSim: () => void;
    onEdit: () => void;
    onCopy: () => void;
    onLinkNodes: (event: unknown, from: EmulatorGraphNode, to: EmulatorGraphNode) => void;
    can_link: (from: number, to: number) => boolean;
    enabled_actions: {
        add: boolean,
        copy: boolean,
        edit: boolean,
        run: boolean,
        hw_sim: boolean,
        deploy: boolean,
        delete: boolean
    };
}

type BlockNodeData = {node: EmulatorGraphNode};
type BlockNode = Node<BlockNodeData, "block">;

const KIND_CAPTION = {core: "Core", source: "Source", sink: "Sink"} as const;

const node_style = (node: EmulatorGraphNode, selected: boolean): React.CSSProperties => {
    const io = node.kind === "io";
    const color = !io ? ColorTheme.background.borders : node.direction === "source" ? io_colors.source : io_colors.sink;
    const dashes = !io ? "solid" : "dashed";
    return {
        width: NODE_WIDTH,
        height: NODE_HEIGHT,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "0 0.5em",
        borderRadius: 8,
        borderWidth: 2,
        borderStyle: dashes,
        borderColor: selected ? ColorTheme.emulator.selected_node_border : color,
        // the dash pattern of the source and the sink, told apart even without colors
        ...(io && node.direction === "sink" ? {borderStyle: "dotted"} : {}),
        background: ColorTheme.background.level_3,
        color: ColorTheme.text,
        fontSize: "0.85rem",
        textAlign: "center",
        overflow: "hidden"
    };
};

const BlockNodeView = ({data, selected}: NodeProps<BlockNode>) => {
    const node = data.node;
    const caption = node.kind === "io" ? (node.direction === "source" ? KIND_CAPTION.source : KIND_CAPTION.sink) : KIND_CAPTION.core;
    // a source only feeds the cores and a sink is only fed by them
    const takes_input = node.kind !== "io" || node.direction === "sink";
    const gives_output = node.kind !== "io" || node.direction === "source";
    return (
        <div style={node_style(node, selected)}>
            {takes_input && <Handle type="target" position={Position.Left}/>}
            <span style={{maxWidth: "100%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"}}>{node.text}</span>
            <small style={{opacity: 0.6, fontSize: "0.65rem"}}>{caption}</small>
            {gives_output && <Handle type="source" position={Position.Right}/>}
        </div>
    );
};

const node_types = {block: BlockNodeView};

// the controls of the canvas follow the theme of the application
const flow_class = css`
  & .react-flow__controls-button {
    background: ${ColorTheme.background.level_3};
    color: ${ColorTheme.text};
    border-bottom: 1px solid ${ColorTheme.background.borders};
  }
  & .react-flow__controls-button:hover {
    background: ${ColorTheme.background.level_4};
  }
  & .react-flow__controls-button svg {
    fill: currentColor;
  }
  & .react-flow__handle {
    background: ${ColorTheme.background.level_5};
    border: 1px solid ${ColorTheme.text};
  }
`;

const edge_id = (id: number) => "edge-" + id;

const to_graph_node = (n: BlockNode): EmulatorGraphNode => n.data.node;

let DiagramCanvas = function (props: EmulatorDiagramProps) {

    const flow = useReactFlow();
    const wrapper = useRef<HTMLDivElement>(null);
    const [rf_nodes, set_rf_nodes, on_nodes_change] = useNodesState<BlockNode>([]);
    const [rf_edges, set_rf_edges, on_edges_change] = useEdgesState<Edge>([]);

    // the nodes that were never moved are placed by their connections
    const placed = {...auto_layout(props.nodes, props.edges), ...props.layout};
    const selected_node = props.selection?.type === "node" ? props.selection.obj.id : null;
    const selected_edge = props.selection?.type === "edge" ? props.selection.obj.id : null;

    useEffect(() => {
        set_rf_nodes(props.nodes.map((node): BlockNode => ({
            id: String(node.id),
            type: "block",
            position: placed[node.id] ?? {x: 0, y: 0},
            data: {node: node},
            selected: node.id === selected_node
        })));
        set_rf_edges(props.edges.map((edge): Edge => ({
            id: edge_id(edge.id),
            source: String(edge.from),
            target: String(edge.to),
            selected: edge.id === selected_edge,
            markerEnd: {type: MarkerType.ArrowClosed, width: 18, height: 18},
            style: edge.id === selected_edge ? {stroke: ColorTheme.background.accents, strokeWidth: 3} : {}
        })));
    }, [props.nodes, props.edges, props.layout, props.selection]);

    // the diagram of another emulator is shown whole
    useEffect(() => {
        const timer = setTimeout(() => flow.fitView({padding: 0.3, maxZoom: 1}), 60);
        return () => clearTimeout(timer);
    }, [props.view_key]);

    const handle_node_click = (event: React.MouseEvent, node: BlockNode) => {
        props.onNodeSelect(event, to_graph_node(node));
    };

    // the menu of what is right clicked: what is clicked becomes the selection that the actions work on
    const [menu, set_menu] = useState<{x: number, y: number, copyable: boolean, label: string} | null>(null);
    // the name of what is being deleted, when the user is asked
    const [confirming_delete, set_confirming_delete] = useState<string | null>(null);

    const handle_node_context_menu = (event: React.MouseEvent, node: BlockNode) => {
        event.preventDefault();
        const graph_node = to_graph_node(node);
        props.onNodeSelect(event, graph_node);
        set_menu({x: event.clientX, y: event.clientY, copyable: graph_node.kind === "core", label: graph_node.text});
    };

    const handle_edge_context_menu = (event: React.MouseEvent, edge: Edge) => {
        event.preventDefault();
        handle_edge_click(event, edge);
        set_menu({x: event.clientX, y: event.clientY, copyable: false, label: "connection"});
    };

    const menu_actions = (copyable: boolean, label: string): ContextMenuAction[] => [
        ...(copyable ? [{label: "Copy", onSelect: props.onCopy}] : []),
        {
            label: "Delete",
            danger: true,
            onSelect: () => confirm_delete_enabled() ? set_confirming_delete(label) : props.onDelete()
        }
    ];

    const handle_edge_click = (event: React.MouseEvent, edge: Edge) => {
        props.onEdgeSelect(event, {id: Number(edge.id.slice("edge-".length)), from: Number(edge.source), to: Number(edge.target)});
    };

    const handle_drag_stop = (_event: unknown, _node: BlockNode, moved: BlockNode[]) => {
        const positions: emulator_layout = {};
        for(const n of moved) positions[n.id] = {x: Math.round(n.position.x), y: Math.round(n.position.y)};
        props.onMoveNodes(positions);
    };

    const find_node = (id: string) => props.nodes.find((n) => String(n.id) === id);

    const handle_connect = (connection: Connection) => {
        const from = find_node(connection.source);
        const to = find_node(connection.target);
        if(from && to) props.onLinkNodes(null, from, to);
    };

    const is_valid_connection = (connection: Connection | Edge) => {
        return props.can_link(Number(connection.source), Number(connection.target));
    };

    // the node is dropped with its center under the pointer
    const centered = (position: {x: number, y: number}) => ({x: Math.round(position.x - NODE_WIDTH / 2), y: Math.round(position.y - NODE_HEIGHT / 2)});

    const add_at_center = (kind: BlockKind) => {
        const rect = wrapper.current?.getBoundingClientRect();
        if(!rect) return;
        // each one a bit lower than the previous, so that they do not pile up
        const shift = (props.nodes.length % 6) * 24;
        const center = flow.screenToFlowPosition({x: rect.left + rect.width / 2 + shift, y: rect.top + rect.height / 2 + shift});
        props.onAddBlock(kind, centered(center));
    };

    const handle_drop = (event: React.DragEvent) => {
        const kind = event.dataTransfer.getData(BLOCK_DRAG_TYPE) as BlockKind;
        if(!kind || !props.enabled_actions.add) return;
        event.preventDefault();
        props.onAddBlock(kind, centered(flow.screenToFlowPosition({x: event.clientX, y: event.clientY})));
    };

    const handle_drag_over = (event: React.DragEvent) => {
        if(event.dataTransfer.types.includes(BLOCK_DRAG_TYPE)){
            event.preventDefault();
            event.dataTransfer.dropEffect = "copy";
        }
    };

    return (
        <div style={{height: "100%", display: "flex", flexDirection: "column"}}>
            <EmulatorToolbar
                onRun={props.onRun}
                onDeploy={props.onDeploy}
                onHardwareSim={props.onHardwareSim}
                onEdit={props.onEdit}
                enable={props.enabled_actions}
            />
            <div style={{display: "flex", flexDirection: "row", flex: 1, minHeight: 0}}>
                <EmulatorLibrary enabled={props.enabled_actions.add} onAdd={add_at_center}/>
                <div ref={wrapper} style={{flexGrow: 1, minWidth: 0}} onDrop={handle_drop} onDragOver={handle_drag_over}>
                    <ReactFlow
                        className={flow_class}
                        nodes={rf_nodes}
                        edges={rf_edges}
                        nodeTypes={node_types}
                        onNodesChange={on_nodes_change}
                        onEdgesChange={on_edges_change}
                        onNodeClick={handle_node_click}
                        onEdgeClick={handle_edge_click}
                        onNodeContextMenu={handle_node_context_menu}
                        onEdgeContextMenu={handle_edge_context_menu}
                        onNodeDragStop={handle_drag_stop}
                        onPaneClick={props.onCanvasClick}
                        onConnect={handle_connect}
                        isValidConnection={is_valid_connection}
                        deleteKeyCode={null}
                        nodesConnectable={props.enabled_actions.add}
                        proOptions={{hideAttribution: true}}
                        minZoom={0.2}
                        maxZoom={2}
                    >
                        <Background variant={BackgroundVariant.Dots} gap={20} size={1}/>
                        <Controls showInteractive={false}/>
                    </ReactFlow>
                </div>
            </div>
            {menu && <ContextMenu x={menu.x} y={menu.y} actions={menu_actions(menu.copyable, menu.label)} onClose={() => set_menu(null)}/>}
            {confirming_delete !== null && (
                <ConfirmDialog
                    title={"Delete " + confirming_delete + "?"}
                    message="This cannot be undone."
                    confirm_label="Delete"
                    onCancel={() => set_confirming_delete(null)}
                    onConfirm={(do_not_ask_again) => {
                        set_confirming_delete(null);
                        if(do_not_ask_again) set_confirm_delete(false);
                        props.onDelete();
                    }}
                />
            )}
        </div>
    );
};

let EmulatorDiagram = function (props: EmulatorDiagramProps) {
    return (
        <ReactFlowProvider>
            <DiagramCanvas {...props}/>
        </ReactFlowProvider>
    );
};

export default EmulatorDiagram;
