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

import React, {useContext, useState} from "react";

import {MdCable, MdMemory} from 'react-icons/md'
import {ColorTheme, SelectableListItem} from "@UI";

import 'react-toastify/dist/ReactToastify.css';
import Popup from "reactjs-popup";
import {ApplicationContext} from "@src/AuthApp.jsx";


let LoadSelector = props =>{
    let [selected, set_selected] = useState("");

    const application = useContext(ApplicationContext);

    let onMouseEnter = (name) =>{
        set_selected(name);
    }
    let onClick = () =>{
        let core = Object.values(application.soft_cores).filter((core)=>{
            return selected===core.id;
        })[0];
        props.onLoad(core, application);
    }
    let renderCoresList = () =>{
        let cores_list = Object.values(application.soft_cores).map((core)=>{
            return <SelectableListItem onSelect={onClick} onMouseEnter={onMouseEnter}  icon={<MdMemory style={{marginTop:"auto", marginBottom:"auto"}}/>} key={core.id} selected={selected===core.id} name={core.id}/>
        })
        return(cores_list)
    }

    return(
        <Popup
            trigger={<div>
                <MdCable size={ColorTheme.icons_size} style={{marginLeft:"0.3em"}} color={ColorTheme.icons_color}/>
            </div>}
            position="right top"
            on="hover"
            closeOnDocumentClick
            mouseLeaveDelay={300}
            mouseEnterDelay={0}
            contentStyle={{ padding: '10px', border: 'none', backgroundColor:"#555555", borderRadius:"5px"}}
            arrow={false}
        >
            {renderCoresList()}
        </Popup>
    );


}
export default LoadSelector;