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
import {InputField} from "../InputField";

import {SelectField} from "../Select";
import {up_application} from "../../../client_core";
import {Card} from "../panels/Card";
import styled from "styled-components";
import {useSelector} from "react-redux";
import {SelectableListItem} from "../SelectableListItem";
import {MdArrowBack, MdArrowForward, MdOutlineHorizontalRule, MdSyncAlt} from "react-icons/md";


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

export let  ApplicationSoftCoreProperties = props =>{

    const programs = useSelector(state => state.programs);
    const selected_program = Object.values(programs).filter((program)=>{
        return program.name === props.core.default_program;
    })[0];

    const [sel_logic_io, set_sel_logic_io] = useState("");
    const [sel_core_io, set_sel_core_io] = useState("");

    const [mappings, set_mappings] = useState([]);

    let handleProgramChange = (event)=>{
        let app = new up_application(props.application);
        app.edit_soft_core(props.core.id,event.target.name, event.target.value).then(()=>{
            props.forceUpdate();
        });
    }

    let handleonKeyDown = (event) =>{
        if(event.key==="Enter"|| event.key ==="Tab"){
            let app = new up_application(props.application);
            app.edit_soft_core(props.core.id,event.target.name, event.target.value).then(()=>{
                props.forceUpdate();
            });
        }
    }

    let handleRemove= (event) =>{
        let app = new up_application(props.application);
            app.remove_soft_core(props.core.id).then(()=>{
            props.forceUpdate();
        });
    }


    let programs_list = Object.keys(props.programs).map((prog_id)=>{
        return props.programs[prog_id].name;
    })

    let remove_item = () =>{
    }


    let get_dma_lists = () =>{
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

    let onSync = (props) =>{
        set_mappings([...mappings, [sel_core_io, sel_logic_io]]);
        debugger;
    }

    let generate_dma_io_section = () =>{
        if(selected_program && selected_program.program_type==="C"){
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
                            <h3>LOGIC SIDE IO</h3>
                            {[
                                props.core.io.map((item)=>{
                                    return <SelectableListItem delete onRemove={remove_item} type={item.type}
                                                               name={item.name} onSelect={set_sel_logic_io}
                                                               selected={sel_logic_io===item.name} iconSize="1em"/>
                                })
                            ]}
                        </List>
                        <List>
                            <h3>CORE SIDE IO</h3>
                            {get_dma_lists()}
                        </List>
                    </div>
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


            )
        }
    }

    return(
        <Card
            name={props.core.id}
            onRemove={handleRemove}
        >
            <InputField inline ID="id" name="id" defaultValue={props.core.id} onKeyDown={handleonKeyDown} label="Core ID"/>
            <InputField inline ID="address" name='address' defaultValue={props.core.address} onKeyDown={handleonKeyDown} label="Address"/>
            <SelectField label="Default Program" onChange={handleProgramChange} defaultValue={props.core.default_program}
                         name="default_program" placeholder="Default Program" options={programs_list}/>
            {generate_dma_io_section()}
        </Card>
    );
};
