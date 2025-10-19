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

import React, {useEffect, useState} from "react";
import {get_next_id, up_application} from "#client_core";
import styled from "styled-components";
import {
    SelectableListItem,
    InputField,
    SelectField
} from "#UI";
import {MdAdd} from "react-icons/md";
import {useAppSelector} from "#redux/hooks.js";


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

export let  CoreDmaIo = props =>{

    const programs = useAppSelector(state => state.programs);
    const selected_program = Object.values(programs).filter((program)=>{
        return program.name === props.core.default_program;
    })[0];

    const [sel_logic_io, set_sel_logic_io] = useState("");

    const [selected_io, set_selected_io] = useState(null);

    useEffect(() => {
        if(sel_logic_io){
            let selected_item = props.core.io.filter((item) => {
                return item.name === sel_logic_io;
            })[0];
            set_selected_io(selected_item)
        }
    }, [sel_logic_io])

    let remove_item = (item) =>{
        let app = new up_application(props.application);
        let new_io = props.core.io.filter((io)=>{
            return item !== io.name;
        })
        app.edit_soft_core(props.core.id,"io", new_io).then(()=>{
            props.forceUpdate();
        });
    }

    let generate_logic_io_map = () =>{
        if(props.core.io){
            return [
                props.core.io.map((item)=>{

                    return <SelectableListItem key={item.name} delete onRemove={remove_item} type={item.type}
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
            if(field === "address" ) value = parseInt(value);
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
        let app = new up_application(props.application);
        let new_io = props.core.io.map((io)=>{
            if(sel_logic_io === io.name){
                let new_item = io;
                new_item.associated_io = event.value;
                return new_item
            }
            return io;
        })
        app.edit_soft_core(props.core.id,"io", new_io).then(()=>{
            props.forceUpdate();
        });
    }


    let get_core_io = () =>{
        if(selected_program && selected_program.build_settings){
            let core_io = [];
            if(selected_program.build_settings.io.inputs){
                core_io = selected_program.build_settings.io.inputs.map((item)=>{
                    return {label:item, value:item}
                })
            }
            if(selected_program.build_settings.io.outputs){
                core_io = [ ...core_io, ...selected_program.build_settings.io.outputs.map((item)=>{
                    return {label:item, value:item}
                })]
            }
            if(selected_program.build_settings.io.memories){
                core_io = [ ...core_io, ...selected_program.build_settings.io.memories.map((item)=>{
                    return {label:item, value:item}
                })]
            }
            return core_io;
        } else return [];
    }


    let handle_add_io = () =>{
        let app = new up_application(props.application);

        let ids = props.core.io.map((io)=>{
            const regex = /new_io_(\d+)/g;
            let match = Array.from(io.name.matchAll(regex), m => m[1]);
            if(match.length>0){
                return match;
            } else {
                return undefined;
            }
        });
        ids = ids.filter(Boolean);
        let id = get_next_id(ids.sort());


        let new_io = {
            name:"new_io_"+id,
            type:"input",
            associated_io:"",
            address:0,
            common_io:false
        };

        app.edit_soft_core(props.core.id,"io", [...props.core.io, new_io]).then(()=>{
            props.forceUpdate();
        });
    }

    let render_io_properties = () =>{
        if(selected_io){
           return <div style={{display: "flex", flexDirection: "column"}}>
               <InputField inline id={selected_io.name} name='name' defaultValue={selected_io.name}
                           onKeyDown={handle_edit_logic_io} label="Name"/>
               <SelectField
                   inline
                   label="Type"
                   onChange={handle_change_type}
                   value={{value: selected_io.type, label: selected_io.type}}
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
                   value={{value:selected_io.associated_io, label:selected_io.associated_io}}
                   defaultValue="select associated IO"
                   name="assoc_core_io"
                   options={get_core_io()}
               />
               <InputField inline id={selected_io.address} name='address' defaultValue={selected_io.address}
                           onKeyDown={handle_edit_logic_io} label="Address"/>
           </div>
        }
    }

    return(
        <div>
            <Separator/>
            <List>
                <div style={{
                display:"flex",
                flexDirection:"row",
                marginTop:"0.25em"
            }}>
                <h3>Core IO</h3>
                <MdAdd style={{marginLeft:"auto"}} onClick={handle_add_io}/>
            </div>
                {generate_logic_io_map()}
            </List>
            <Separator/>
            {render_io_properties()}
        </div>
    );
};