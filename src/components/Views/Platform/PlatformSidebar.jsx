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

import React, {useEffect, useState} from 'react';

import {
    UIPanel,
    SimpleContent,
    SelectableList, ColorTheme
} from "@UI";

import {get_users_list, remove_user} from "@client_core";
import {MdPerson} from "react-icons/md";

let  PlatformSidebar = props =>{

    const [users, setUsers] = useState([])
    const [refreshList, setRefreshList] = useState(false)

    useEffect(()=>{
        get_users_list().then((response)=>{
            setUsers(response)
        })
    },[props.view_version, refreshList])

    let handleRemoveUser = (username) =>{
        remove_user(username).then((response)=>{
            setRefreshList(!refreshList);
        })
    }


    let get_content = () =>{
        let types = [];
        let items = Object.values(users).map((user)=>{
            let color="";
            if(user.role ==="admin"){
                color = "green";
            } else if(user.role === "user"){
                color = "blue";
            } else if(user.role === "operator"){
                color = "red";
            }
            types.push(<MdPerson size={ColorTheme.icons_size} color={color} />);
            return user.username;
        })

        return [items, types]
    }


    const [names, types] = get_content();

    let handleOnSelect = (selection) => {
        if(props.user !==selection){
            props.on_select(selection);
        }
    };



    return (
        <UIPanel key="users_list" level="level_2">
            <SimpleContent name="Users List" content={
                <SelectableList
                    items={names}
                    types={types}
                    selected_item={props.user}
                    onRemove={handleRemoveUser}
                    onSelect={handleOnSelect}
                />
            }/>
        </UIPanel>
        );

};

export default PlatformSidebar;
