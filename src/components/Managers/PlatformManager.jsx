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

import {useDispatch, useSelector} from "react-redux"
import {
    Button,
    UIPanel,
    SimpleContent,
    FormLayout,
    InputField,
    SelectField, ColorTheme
} from "../UI_elements"

import {setSetting} from "../../redux/Actions/SettingsActions";
import {Responsive, WidthProvider} from "react-grid-layout";
import {add_user, do_onboarding, dump_database, restore_database, upload_json} from "../../client_core";
import { MdDownload, MdUpload} from "react-icons/md";
import {Tooltip} from "react-tooltip";


let  PlatformManager = props =>{
    const ResponsiveGridLayout = WidthProvider(Responsive);

    const settings = useSelector(state => state.settings);
    const dispatch = useDispatch()

    let handle_add_user = (event) =>{

        event.preventDefault();
        let username = event.target.user.value;
        let pass = event.target.pass.value;
        let role = event.target.role.value;
        if(props.onboarding){
            do_onboarding({user:username,password:pass, role:role}).then(res =>{
                dispatch(setSetting(["refresh_user_view", !settings.refresh_user_view]));
            })
            props.onboarding_done();
        } else{
            add_user({user:username,password:pass, role:role}).then(res =>{
                dispatch(setSetting(["refresh_user_view", !settings.refresh_user_view]));
            })
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

        })
    };

    let handle_restore_db = ()=>{
        upload_json().then((raw_json)=>{
            let content = JSON.parse(raw_json.data);
            restore_database(content).then();
        }).catch((err)=>{
            alert(err.message);
        })
    };

    let constructActionsBar = () =>{
        return(
            <div style={{display:"flex", marginRight:"0.5em", justifyContent:"right"}}>
                <div id="import_icon">
                    <MdUpload onClick={handle_restore_db} size="2em" style={{marginLeft:"0.3em"}} color={ColorTheme.icons_color}/>
                    <Tooltip anchorId="import_icon" content="Restore Database" place="top" />
                </div>
                <div id="export_icon">
                    <MdDownload onClick={handle_dump_db} size="2em" style={{marginLeft:"0.3em"}} color={ColorTheme.icons_color}/>
                    <Tooltip anchorId="export_icon" content="Dump Database" place="top" />
                </div>
            </div>
        )
    }

    return(
        <ResponsiveGridLayout
            className="layout"
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
            cols={{ lg: 24, md: 20, sm: 12, xs: 8, xxs: 4 }}
            rowHeight={30}
            useCSSTransforms={false}
        >

            <UIPanel key="platform_management" data-grid={{x: 0, y: 0, w: 24, h: 7, static: true}} level="level_2">
                <SimpleContent name="Platform Management" content={
                    <div>
                        {constructActionsBar()}
                        <form onSubmit={handle_add_user}>
                            <FormLayout>
                                <InputField inline name="user" label="Username"/>
                                <InputField inline name="pass" label="Password"/>
                                <SelectField label="Role" defaultValue="role"
                                             name="role" placeholder="Role" options={[
                                    {value:"admin",label:"admin"},
                                    {value:"user",label:"user"},
                                    {value:"operator",label:"operator"}
                                ]}/>
                                <Button> Add User </Button>
                            </FormLayout>
                        </form>
                    </div>
                }/>
            </UIPanel>
        </ResponsiveGridLayout>
    );
};


export default PlatformManager;
