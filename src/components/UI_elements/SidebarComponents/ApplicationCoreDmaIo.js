// Copyright 2021 University of Nottingham Ningbo China
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

import React, {useState} from "react";
import {up_application} from "../../../client_core";
import styled from "styled-components";
import {useSelector} from "react-redux";
import {SelectableListItem} from "../SelectableListItem";
import {MdAdd, MdArrowBack, MdArrowForward, MdOutlineHorizontalRule, MdSyncAlt} from "react-icons/md";
import {InputField} from "../InputField";
import {SelectField} from "../Select";


const List = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  margin-left: auto;
  margin-right: auto;
`

const Separator = styled.div`
  margin-top: 1em;
  margin-left: auto;
  margin-right: auto;
  width:15em;
  height: 2px;
  background-color: ${props => props.theme.background.bordersLight};
`

export let  ApplicationCoreDmaIo = props =>{

    const programs = useSelector(state => state.programs);
    const selected_program = Object.values(programs).filter((program)=>{
        return program.name === props.core.default_program;
    })[0];

    const [sel_logic_io, set_sel_logic_io] = useState("");
    const [sel_core_io, set_sel_core_io] = useState("");

    const [mappings, set_mappings] = useState([]);

    let remove_item = () =>{

    }


    let get_dma_lists = () =>{

        if(selected_program && selected_program.build_settings){
            let io_list = [];
            if(selected_program.build_settings.io.inputs){
                io_list = selected_program.build_settings.io.inputs.map((item)=>{
                    return <SelectableListItem onSelect={set_sel_core_io} iconSize="1em" type="inputs" name={item}
                                               selected={sel_core_io===item}/>
                })
            }
            if(selected_program.build_settings.io.outputs){
                io_list = [ io_list, ...selected_program.build_settings.io.outputs.map((item)=>{
                    return <SelectableListItem onSelect={set_sel_core_io} iconSize="1em" type="outputs" name={item}
                                               selected={sel_core_io===item}/>
                })]
            }
            if(selected_program.build_settings.io.memory){
                io_list = [ io_list, ...selected_program.build_settings.io.memory.map((item)=>{
                    return <SelectableListItem onSelect={set_sel_core_io} iconSize="1em" type="memory" name={item}
                                               selected={sel_core_io===item}/>
                })]
            }
            return io_list;
        }
        else return <></>

    }

    let onSync = (props) =>{
        let new_mapping = [...mappings, [sel_core_io, sel_logic_io]];
        set_mappings(new_mapping);

        let app = new up_application(props.application);
        app.edit_soft_core(props.core.id,"dma_mapping", new_mapping).then(()=>{
            props.forceUpdate();
        });
    }

    let generate_logic_io_map = () =>{
        if(props.core.io){
            return [
                props.core.io.map((item)=>{

                    return <SelectableListItem delete onRemove={remove_item} type={item.type}
                                               name={item.name} onSelect={set_sel_logic_io}
                                               selected={sel_logic_io===item.name} iconSize="1em"/>
                })
            ]
        }

    }


    let handle_edit_logic_io = (event) =>{
        if(event.key==="Enter"|| event.key ==="Tab"){
            let field = event.target.name;
            let value = event.target.value;
            let app = new up_application(props.application);
            let new_io = props.core.io.map((io)=>{
                if(sel_logic_io === io.name){
                    let new_item = io;
                    new_item[field] = value;
                    return new_item
                }
                return io;
            })

            app.edit_soft_core(props.core.id,"io", new_io).then(()=>{
                props.forceUpdate();
            });
        }

    }

    let handle_change_type = (event) =>{

        let app = new up_application(props.application);
        let new_io = props.core.io.map((io)=>{
            if(sel_logic_io === io.name){
                let new_item = io;
                new_item.type = event.value;
                return new_item
            }
            return io;
        })
        app.edit_soft_core(props.core.id,"io", new_io).then(()=>{
            props.forceUpdate();
        });
    }

    let handle_change_core_io = (event) =>{

    }


    let render_selected_io_properties = ()=>{
        let selected_item=[];

        if(sel_logic_io) {
            selected_item = props.core.io.filter((item) => {
                return item.name === sel_logic_io;
            })[0];
            return (
                <div style={{display: "flex", flexDirection: "column"}}>
                    <InputField inline ID="name" name='name' value={selected_item.name}
                                onKeyDown={handle_edit_logic_io} label="Name"/>
                    <SelectField
                        inline
                        label="Type"
                        onChange={handle_change_type}
                        value={{value: selected_item.type, label: selected_item.type}}
                        defaultValue="Select Type"
                        name="type"
                        options={[
                            {label: "input", value: "input"},
                            {label: "output", value: "output"},
                            {label: "memory", value: "memory"}
                        ]}
                    />
                    <SelectField
                        inline
                        label="Associated Core IO"
                        onChange={handle_change_core_io}
                        defaultValue="select associated IO"
                        name="assoc_core_io"
                        options={[
                            {label: "io_1", value: "io_1"},
                            {label: "io_2", value: "io_2"},
                            {label: "io_3", value: "io_3"}
                        ]}
                    />
                    <InputField inline ID="address" name='address' value={selected_item.address}
                                onKeyDown={handle_edit_logic_io} label="Address"/>
                </div>
            )
        } else return null;
    }


    return(
        <div>
            <Separator/>
            <div style={{
                display:"flex",
                flexDirection:"row",
                justifyContent:"right",
                marginTop:"0.25em"
            }}>
                <MdSyncAlt onClick={onSync}/>
            </div>
            <div style={{
                display:"flex",
                flexDirection:"row"
            }}>
                <List>
                    <h3>LOGIC</h3>
                    {generate_logic_io_map()}
                </List>
                <List>
                    <h3>CORE</h3>
                    {get_dma_lists()}
                </List>
            </div>
            {render_selected_io_properties()}
            <Separator/>
            <List>
                <h3>IO MAPPING</h3>
                {
                    mappings.map(([core_io, logic_io]) =>{
                        return(
                            <div style={{
                                display:"flex",
                                flexDirection:"row",
                                marginLeft:"auto",
                                alignItems:"center",
                                marginRight:"auto"
                            }}>
                                <p>{logic_io}</p>
                                <MdArrowBack/>
                                <MdOutlineHorizontalRule style={{
                                    marginRight:"-5px",
                                    marginLeft:"-6px"
                                }}/>
                                <MdOutlineHorizontalRule style={{
                                    marginRight:"-5px",
                                    marginLeft:"-5px"
                                }}/>
                                <MdOutlineHorizontalRule style={{
                                    marginRight:"-5px",
                                    marginLeft:"-5px"
                                }}/>
                                <MdOutlineHorizontalRule style={{
                                    marginRight:"-5px",
                                    marginLeft:"-5px"
                                }}/>
                                <MdOutlineHorizontalRule style={{
                                    marginRight:"-5px",
                                    marginLeft:"-5px"
                                }}/>
                                <MdOutlineHorizontalRule style={{
                                    marginRight:"-6px",
                                    marginLeft:"-5px"
                                }}/>
                                <MdArrowForward/>
                                <p>{core_io}</p>
                            </div>)
                    })
                }
            </List>
        </div>
    );
};