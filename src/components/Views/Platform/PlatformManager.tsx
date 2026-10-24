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
import {styled} from "goober";
import {MdDownload, MdPersonAdd, MdUpload, MdVpnKey} from "react-icons/md";
import {toast} from "react-toastify";

import {
    Button,
    ColorTheme,
    ConfirmDialog,
    InputField,
    PaneGroup,
    RadioGroup,
    Toolbar,
    ToolbarButton,
    UIPanel
} from "#UI/index.js"
import {add_user, dump_database, edit_user, get_users_list, restore_database, upload_json} from "#client_core/index.js";
import {error_text} from "#client_core/proxy/errors.js";
import PlatformSidebar from "../Platform/PlatformSidebar.js";
import type {user_model} from "#interfaces/index.js";

// what each role gets to see, as the views of the app are given to them
const ROLES = [

    {value: "admin", label: "Administrator", description: "Also manages the peripherals, the platform and the settings"},
    {value: "user", label: "User", description: "Also edits the applications, scripts, programs, bitstreams, filters and emulators"},
    {value: "operator", label: "Operator", description: "Uses the scope"}
];

// the cards sit side by side when there is room for them, so that they do not leave the page empty below
const Cards = styled('div')`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(24rem, 1fr));
  gap: 0.8em;
  align-items: start;
  padding: 0.8em;
`

const Section = styled('section')`
  display: flex;
  flex-direction: column;
  gap: 0.6em;
  padding: 0.7em 1em 0.9em;
  border-radius: 8px;
  border: 1px solid ${ColorTheme.background.borders};
  background: ${ColorTheme.background.level_3};
`

const SectionTitle = styled('h3')`
  margin: 0;
  font-size: 0.95rem;
`

// two fields side by side
const FieldRow = styled('div')`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.6em;
`

// the role chooser, with what the role gets to see beside it, and the action of the card at the end
const ActionRow = styled('div')`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.6em 1em;
`

const Hint = styled('div')`
  flex: 1 1 12rem;
  font-size: 0.8rem;
  opacity: 0.6;
`

let  PlatformManager = () =>{

    const [users, set_users] = useState<user_model[]>([]);
    const refresh_users = () => get_users_list().then((list: user_model[]) => set_users(list)).catch((err: unknown) => toast.error(error_text(err)));
    useEffect(() => {refresh_users();}, []);

    // the user whose account is edited, from the list
    const [selected_user, set_selected_user] = useState("");
    const user = users.find((u) => u.username === selected_user);
    // the platform could not be managed without an administrator: the only one cannot be given another role
    const only_admin = user?.role === "admin" && users.filter((u) => u.role === "admin").length <= 1;
    const [new_password, set_new_password] = useState("");
    const [password_key, reset_password] = useState(0);

    // what is changed of a user: the list is read again, and the selection follows the name
    const change_user = async (name: string, changes: {user?: string, password?: string, role?: string}, done: string) => {
        try{
            await edit_user(name, changes);
            if(changes.user !== undefined && selected_user === name) set_selected_user(changes.user);
            toast.success(done);
            await refresh_users();
        } catch (err) {
            toast.error(error_text(err));
            // the field that asked shows that it was not applied
            throw err;
        }
    };

    // for what is not a field, that has nobody to tell
    const change_user_quietly = (name: string, changes: {user?: string, password?: string, role?: string}, done: string) =>
        change_user(name, changes, done).catch(() => {});

    let handle_rename = (event: React.KeyboardEvent<HTMLInputElement>) =>{
        if(!user || (event.key !== "Enter" && event.key !== "Tab")) return;
        const new_name = event.currentTarget.value.trim();
        if(new_name === "" || new_name === user.username) return;
        return change_user(user.username, {user: new_name}, user.username + " renamed to " + new_name);
    };

    let handle_change_password = async () =>{
        if(!user || new_password === "") return;
        await change_user_quietly(user.username, {password: new_password}, "Password of " + user.username + " changed");
        set_new_password("");
        reset_password(password_key + 1);
    };

    // the form starts afresh, with new fields, after a user is added
    const [form_key, reset_form] = useState(0);
    const [username, set_username] = useState("");
    const [password, set_password] = useState("");
    const [role, set_role] = useState("operator");
    const [adding, set_adding] = useState(false);

    const name = username.trim();
    const taken = name !== "" && users.some((user) => user.username === name);
    const can_add = name !== "" && password !== "" && !taken && !adding;

    let handle_add_user = async (event: React.FormEvent<HTMLFormElement>) =>{
        event.preventDefault();
        if(!can_add) return;
        set_adding(true);
        try{
            await add_user({user: name, password: password, role: role});
            toast.success("User " + name + " added");
            set_username("");
            set_password("");
            reset_form(form_key + 1);
            await refresh_users();
        } catch (err) {
            toast.error(error_text(err));
        } finally {
            set_adding(false);
        }
    };

    let handle_dump_db = ()=>{
        dump_database().then((response)=>{
            let encodedUri = encodeURI('data:text/json;charset=utf-8,'+ JSON.stringify(response));
            let link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", "dump.db");
            link.setAttribute("id", "csv_download_link");
            document.body.appendChild(link);

            link.click();
            link.remove();

        }).catch((err: unknown) => toast.error(error_text(err)));
    };

    // the content of the file that was chosen, until the user confirms that it replaces the database
    const [restoring, set_restoring] = useState<any>(null);

    let handle_choose_restore = ()=>{
        upload_json().then((raw_json: any)=>{
            set_restoring(JSON.parse(raw_json.data));
        }).catch((err)=>{
            toast.error(err.message ?? error_text(err));
        })
    };

    let handle_restore_db = async () =>{
        const content = restoring;
        set_restoring(null);
        try{
            await restore_database(content);
            toast.success("Database restored");
            await refresh_users();
        } catch (err) {
            toast.error(error_text(err));
        }
    };

    return(
        <PaneGroup id="platform" orientation="horizontal">
            <UIPanel id="main" key="platform_management" level="level_2" default_size={72} min_size={30} collapsible={false}>
                <Toolbar>
                    <ToolbarButton label="Dump database" tooltip="Download the whole database as a file" icon={<MdDownload size="1.5em"/>} onClick={handle_dump_db}/>
                    <ToolbarButton label="Restore database" tooltip="Replace the database with the content of a dump" icon={<MdUpload size="1.5em"/>} onClick={handle_choose_restore}/>
                </Toolbar>
                <div style={{flex: 1, minHeight: 0, overflowY: "auto"}}>
                    <Cards>
                        <Section>
                            <SectionTitle>Add a user</SectionTitle>
                            <form onSubmit={handle_add_user} style={{display: "flex", flexDirection: "column", gap: "0.6em"}}>
                                <FieldRow key={form_key}>
                                    <InputField
                                        name="user"
                                        label="Username"
                                        onChange={(event) => set_username(event.target.value)}
                                        error={taken ? "There is a user with this name already" : undefined}
                                    />
                                    <InputField
                                        name="pass"
                                        label="Password"
                                        type="password"
                                        onChange={(event) => set_password(event.target.value)}
                                    />
                                </FieldRow>
                                <ActionRow>
                                    <RadioGroup variant="segmented" name="role" label="Role" value={role} onChange={set_role} options={ROLES.map(({value, label}) => ({value, label}))}/>
                                    <Hint>{ROLES.find((r) => r.value === role)?.description}</Hint>
                                    <Button type="submit" disabled={!can_add} style={{opacity: can_add ? 1 : 0.5, display: "flex", alignItems: "center", gap: "0.4em"}}>
                                        <MdPersonAdd size="1.3em"/> Add user
                                    </Button>
                                </ActionRow>
                            </form>
                        </Section>
                        {user &&
                            <Section>
                                <SectionTitle>Account of {user.username}</SectionTitle>
                                <FieldRow>
                                    <InputField
                                        name="rename"
                                        label="Username"
                                        defaultValue={user.username}
                                        onKeyDown={handle_rename}
                                    />
                                    <div key={password_key}>
                                        <InputField
                                            name="new_pass"
                                            label="New password"
                                            type="password"
                                            onChange={(event) => set_new_password(event.target.value)}
                                        />
                                    </div>
                                </FieldRow>
                                <ActionRow>
                                    <RadioGroup
                                        variant="segmented"
                                        name="edit_role"
                                        label="Role"
                                        value={user.role}
                                        onChange={(value) => change_user_quietly(user.username, {role: value}, "Role of " + user.username + " changed")}
                                        options={ROLES.map(({value, label}) => ({
                                            value,
                                            label,
                                            disabled: only_admin && value !== "admin" ? "This is the only administrator, there has to be one" : undefined
                                        }))}
                                    />
                                    <Hint>{only_admin ? "The only administrator: make another user one first" : ROLES.find((r) => r.value === user.role)?.description}</Hint>
                                    <Button onClick={handle_change_password} disabled={new_password === ""} style={{opacity: new_password !== "" ? 1 : 0.5, display: "flex", alignItems: "center", gap: "0.4em"}}>
                                        <MdVpnKey size="1.3em"/> Change password
                                    </Button>
                                </ActionRow>
                            </Section>
                        }
                    </Cards>
                </div>
                {restoring !== null &&
                    <ConfirmDialog
                        title="Restore the database?"
                        message="Everything in the database is replaced by the content of the file. This cannot be undone."
                        confirm_label="Restore"
                        allow_skip={false}
                        onCancel={() => set_restoring(null)}
                        onConfirm={handle_restore_db}
                    />
                }
            </UIPanel>
            <PlatformSidebar
                users={users}
                selected={selected_user}
                on_select={set_selected_user}
                on_changed={refresh_users}
            />
        </PaneGroup>

    );
};


export default PlatformManager;
