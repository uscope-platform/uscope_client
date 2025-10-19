// Copyright 2025 Filippo Savi
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
import {SimpleContent, UIPanel} from "#UI";

let  ProgressPanel = props =>{


    const progress_percentage = props.progress.current/props.progress.total_steps;

    return (
        <UIPanel key="progress_panel" style={{minHeight:"200px"}} level="level_2">
            <SimpleContent name={"Progress"}>
                <div>
                    <progress value={progress_percentage}/>
                </div>
            </SimpleContent>

        </UIPanel>
    );
};

export default ProgressPanel;
