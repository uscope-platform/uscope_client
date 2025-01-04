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

import React, {useCallback, useContext, useState} from 'react';

import {FormLayout,SelectField} from "@UI";
import {ApplicationContext} from "@src/AuthApp.jsx";


let  EnablesProperties = props =>{

    const application = useContext(ApplicationContext);

    let default_group = application.get_default_channel_group().group_name;
    const [selected, set_selected] = useState({label:default_group, value:default_group});

    const group_options = application.channel_groups.map((group,i) => (
        {label:group.group_name, value:group.group_name}
    ));

    let handleChGroupChange = useCallback((object) => {

        set_selected(object);
        let group = application.get_group_by_name(object.value)
        props.on_group_change(group)

    }, [application.channel_groups]);

    return (
        <div style={{padding:"1rem"}}>
            <FormLayout>
                <SelectField
                    label="Channel Group"
                    name="channel_group"
                    onChange={handleChGroupChange}
                    options={group_options}
                    value={selected}
                />
            </FormLayout>
        </div>
    );
};

export default EnablesProperties;
