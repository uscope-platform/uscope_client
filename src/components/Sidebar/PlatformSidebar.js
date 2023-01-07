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

import React, {useEffect, useRef, useState} from 'react';

import {useDispatch, useSelector} from "react-redux";
import {
    Button,
    UIPanel,
    SimpleContent,
    SelectableList, ColorTheme
} from "../UI_elements";
import {setSetting} from "../../redux/Actions/SettingsActions";

import {dump_database, get_users_list, remove_user, restore_database} from "../../client_core";
import {Responsive, WidthProvider} from "react-grid-layout";
import {useLocation} from "react-router-dom";
import {MdPerson} from "react-icons/md";

let  PlatformSidebar = props =>{
    const ResponsiveGridLayout = WidthProvider(Responsive);

    const location = useLocation();
    const settings = useSelector(state => state.settings);
    const dispatch = useDispatch()
    const databaseFile = useRef(null)
    const [users, setUsers] = useState([])
    const [refreshList, setRefreshList] = useState(false)

    useEffect(()=>{
        get_users_list().then((response)=>{
            setUsers(response)
        })
    },[dispatch, location, settings.refresh_user_view, refreshList])

    let handleRemoveUser = (username) =>{
        remove_user({user:username}).then((response)=>{
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
        if(settings.selected_user !==selection){
            dispatch(setSetting(["selected_user", selection]));
        }
    };



    return (
            <ResponsiveGridLayout
                className="layout"
                breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                cols={{ lg: 24, md: 20, sm: 12, xs: 8, xxs: 4 }}
                useCSSTransforms={false}
            >
                <UIPanel key="users_list" data-grid={{x: 0, y: 0, w: 24, h: 3, static: true}} level="level_2">
                    <SimpleContent name="Users List" content={
                        <SelectableList items={names} types={types} selected_item={settings.selected_user} onRemove={handleRemoveUser} onSelect={handleOnSelect} />
                    }/>
                </UIPanel>
            </ResponsiveGridLayout>
        );

};

export default PlatformSidebar;
