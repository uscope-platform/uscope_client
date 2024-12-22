// Copyright 2024 Filippo Savi
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
import {SelectableList, SimpleContent, UIPanel} from "../../../UI_elements/index.jsx";

let  IoViewer = props =>{


    return (
        <UIPanel key="io_viewer" style={{minHeight:"200px"}} level="level_2">
            <SimpleContent name={"IO Viewer"} content={[
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gridColumnGap: "1em",
                }}>
                    <div>
                        <SelectableList
                            items={props.io.names}
                        />
                    </div>
                    <div>
                        <SelectableList
                            items={props.io.values}
                        />
                    </div>
                </div>
            ]}/>
        </UIPanel>
    );
};

export default IoViewer;
