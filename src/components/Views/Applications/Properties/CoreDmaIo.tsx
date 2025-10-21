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
import {get_next_id, up_application} from "#client_core/index.js";
import {styled} from "goober";
import {
    SelectableListItem,
    InputField,
    SelectField, ColorTheme
} from "#UI/index.js";
import {MdAdd, MdDelete} from "react-icons/md";
import {useAppSelector} from "#redux/hooks.js";
import type {soft_core} from "#interfaces/index.js";
import type {SimpleStringOption} from "#UI/Select.js";


const List = styled('div')`
  display: flex;
  flex-direction: column;
  text-align: center;
  margin-left: auto;
  margin-right: auto;
`

const Separator = styled('div')`
  margin-top: 1em;
  margin-left: auto;
  margin-right: auto;
  width:15em;
  height: 2px;
  background-color: ${() => ColorTheme.background.bordersLight};
`

interface  CoreDmaIoProps {
    application: up_application,
    core: soft_core,
    forceUpdate: ()=>void,
}


export let  CoreDmaIo = (props: CoreDmaIoProps) =>{

    const programs = useAppSelector(state => state.programs);
    const selected_program = Object.values(programs).filter((program)=>{
        return program.name === props.core.default_program;
    })[0];

    const [sel_logic_io, set_sel_logic_io] = useState("");

    const [selected_io, set_selected_io] = useState({
        name:"",
        type:"input",
        associated_io:"",
        address:0,
        common_io:false,
    });

    useEffect(() => {
        if(sel_logic_io){
            let selected_item = props.core.io.filter((item) => {
                return item.name === sel_logic_io;
            })[0];
            set_selected_io(selected_item)
        }
    }, [sel_logic_io])

    let remove_item = async (item: string) =>{

        let new_io = props.core.io.filter((io)=>{
            return item !== io.name;
        })
        await props.application.edit_soft_core(props.core.id,"io", new_io);
        props.forceUpdate();
    }

    let generate_logic_io_map = () =>{
        if(props.core.io){
            return [
                props.core.io.map((item)=>{

                    return <SelectableListItem key={item.name} onRemove={remove_item}
                                               name={item.name} onSelect={set_sel_logic_io}
                                               selected={sel_logic_io===item.name} iconSize="1em" icon={<MdDelete/>}/>
                })
            ]
        }

    }


    let handle_edit_logic_io =async (event: React.KeyboardEvent<HTMLInputElement>) =>{
        if(event.key==="Enter"|| event.key ==="Tab"){
            let field = event.currentTarget.name;

            let new_io = props.core.io.map((io)=>{
                if(sel_logic_io === io.name){
                    let new_item = io;
                    if(field === "address" ){
                        new_item[field] = parseInt(event.currentTarget.value);
                    } else {
                        new_item[field] = event.currentTarget.value
                    }
                    return new_item
                }
                return io;
            })

            await props.application.edit_soft_core(props.core.id,"io", new_io);
            props.forceUpdate();
        }

    }

    let handle_change_type = async (change:SimpleStringOption | null) =>{
        if(change === null) return;
        let new_io = props.core.io.map((io)=>{
            if(sel_logic_io === io.name){
                let new_item = io;
                new_item.type = change.value;
                return new_item
            }
            return io;
        })

        await props.application.edit_soft_core(props.core.id,"io", new_io);
        props.forceUpdate();
    }

    let handle_change_core_io =async (change:SimpleStringOption | null) =>{
        if(change === null) return;
        let new_io = props.core.io.map((io)=>{
            if(sel_logic_io === io.name){
                let new_item = io;
                new_item.associated_io = change.value;
                return new_item
            }
            return io;
        })

        await props.application.edit_soft_core(props.core.id,"io", new_io);
        props.forceUpdate();
    }


    let get_core_io = () =>{
        if(selected_program && selected_program.build_settings){
            let core_io = [];
            if(selected_program.build_settings.io.inputs){
                core_io = selected_program.build_settings.io.inputs.map((item: string)=>{
                    return {label:item, value:item}
                })
            }
            if(selected_program.build_settings.io.outputs){
                core_io = [ ...core_io, ...selected_program.build_settings.io.outputs.map((item: string)=>{
                    return {label:item, value:item}
                })]
            }
            if(selected_program.build_settings.io.memories){
                core_io = [ ...core_io, ...selected_program.build_settings.io.memories.map((item: string)=>{
                    return {label:item, value:item}
                })]
            }
            return core_io;
        } else return [];
    }


    let handle_add_io = async () =>{

        let ids = props.core.io.map((io)=>{
            const regex = /new_io_(\d+)/g;
            let match = io.name.match(regex);
            if (match) {
                return match[1];
            }
        }).filter((item)=>{return item !== undefined}).flat();
        let id = get_next_id(ids.sort());


        let new_io = {
            name:"new_io_"+id,
            type:"input",
            associated_io:"",
            address:0,
            common_io:false
        };

        await props.application.edit_soft_core(props.core.id,"io", [...props.core.io, new_io]);
        props.forceUpdate();
    }

    let render_io_properties = () =>{
        if(selected_io){
           return <div style={{display: "flex", flexDirection: "column"}}>
               <InputField inline id={selected_io.name} name='name' defaultValue={selected_io.name}
                           onKeyDown={handle_edit_logic_io} label="Name"/>
               <SelectField<SimpleStringOption>
                   label="Type"
                   onChange={handle_change_type}
                   value={{value: selected_io.type, label: selected_io.type}}
                   defaultValue={{label: "Select type", value: ""}}
                   name="type"
                   options={[
                       {label: "input", value: "input"},
                       {label: "output", value: "output"},
                       {label: "memory", value: "memory"}
                   ]}
               />
               <SelectField<SimpleStringOption>
                   label="Associated Core IO"
                   onChange={handle_change_core_io}
                   value={{value:selected_io.associated_io, label:selected_io.associated_io}}
                   defaultValue={{label: "select associated IO", value: ""}}
                   name="assoc_core_io"
                   options={get_core_io()}
               />
               <InputField inline id={selected_io.address.toString()} name='address' defaultValue={selected_io.address.toString()}
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