// Copyright 2021 Filippo Savi
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
import {InputField, ListItem} from "../../UI_elements";
import styled from "styled-components";
import {MdDelete} from "react-icons/md";

const VariablesList = styled.div`
  margin-top:0.5em;
  display: flex;
  flex-direction: column;
  text-align: center;
  
`

const VariablesInputArea = styled.div`
  margin-top:0.75em;
  padding: 0;
  background-color: ${props => props.theme.background.level_3};
  border-style: solid;
  border-color: ${props => props.theme.background.bordersLight};
  border-width: 2px;
  text-align: center;
`


let BuildSettings = props =>{

    let [inputs, set_inputs] = useState([]);
    let [outputs, set_outputs] = useState([]);
    let [memories, set_memories] = useState([]);

    let remove_item = (item) =>{
        switch (item.type){
            case "input":
                set_inputs(inputs.filter((in_item=>{
                    return in_item !== item.name;
                })))
                break;
            case "output":
                set_outputs(outputs.filter((out_item=>{
                    return out_item !== item.name;
                })))
                break;
            case "memory":
                set_memories(memories.filter((mem_item=>{
                    return mem_item !== item.name;
                })))
                break;
            default:
                return;
        }
    }

    let handle_edit = (event) =>{
        if(event.key==="Enter"){
            switch (event.target.name){
                case "input":
                    set_inputs([...inputs, event.target.value])
                    break;
                case "output":
                    set_outputs([...outputs, event.target.value])
                    break;
                case "memory":
                    set_memories([...memories, event.target.value])
                    break;
                default:
                    return;
            }
        }
    }

    return(
        <div style={{
            display:"flex",
            flexDirection:"row",
            gap:"10em",
            justifyContent:"center"
        }}>
            <VariablesInputArea>
                <h2>INPUTS</h2>
                <div style={{margin:"0.5em 1.5em 0.5em 1.5em"}}>
                    <InputField name="input" onKeyDown={handle_edit} />
                    <VariablesList>
                        {[
                            inputs.map((item)=>{
                                return <ListItem onRemove={remove_item} type="input" name={item}/>
                            })
                        ]}
                    </VariablesList>
                </div>
            </VariablesInputArea>
            <VariablesInputArea>
                <h2>OUTPUTS</h2>
                <div style={{margin:"0.5em 1.5em 0.5em 1.5em"}}>
                    <InputField name="output" onKeyDown={handle_edit} />
                    <VariablesList>
                        {[
                            outputs.map((item)=>{
                                return <ListItem onRemove={remove_item} type="output" name={item}/>
                            })
                        ]}
                    </VariablesList>
                </div>
            </VariablesInputArea>
            <VariablesInputArea>
                <h2>MEMORY</h2>
                <div style={{margin:"0.5em 1.5em 0.5em 1.5em"}}>
                    <InputField name="memory" onKeyDown={handle_edit} />
                    <VariablesList>
                        {[
                            memories.map((item)=>{
                                return <ListItem onRemove={remove_item} type="memory" name={item}/>
                            })
                        ]}
                    </VariablesList>
                </div>
            </VariablesInputArea>
        </div>
    );
}

export default BuildSettings;