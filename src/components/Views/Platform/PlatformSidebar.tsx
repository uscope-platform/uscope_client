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

import React from 'react';
import {toast} from "react-toastify";
import {MdAdminPanelSettings, MdPerson, MdSpeed} from "react-icons/md";

import {SidebarColumn, SelectableList, ColorTheme} from "#UI/index.js";

import {remove_user} from "#client_core/index.js";
import {error_text} from "#client_core/proxy/errors.js";
import type {user_model} from "#interfaces/index.js";

interface PlatformSidebarProps {
    users: user_model[];
    selected: string;
    on_select: (username: string) => void;
    // told when a user was removed, for the list to be read again
    on_changed: () => void;
}

const ROLE_ICONS: Record<string, React.ReactNode> = {
    admin: <MdAdminPanelSettings size="1.6em" color={ColorTheme.icons_color}/>,
    user: <MdPerson size="1.6em" color={ColorTheme.icons_color}/>,
    operator: <MdSpeed size="1.6em" color={ColorTheme.icons_color}/>,
};

let  PlatformSidebar = (props: PlatformSidebarProps) =>{

    let handleRemoveUser = (username: string) =>{
        remove_user(username).then(() => {
            props.on_changed();
        }).catch((err: unknown) => toast.error(error_text(err)));
    }

    return (
        <SidebarColumn panels={[{title: "Users", content: (
            <SelectableList
                variant="card"
                items={props.users.map((user) => user.username)}
                types={props.users.map((user) => ROLE_ICONS[user.role] ?? ROLE_ICONS.user)}
                descriptions={props.users.map((user) => user.role)}
                selected_item={props.selected}
                onSelect={props.on_select}
                onRemove={handleRemoveUser}
                style={{maxHeight: "none"}}
            />
        )}]}/>
    );

};

export default PlatformSidebar;
