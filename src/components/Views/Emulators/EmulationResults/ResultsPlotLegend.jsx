// Copyright 2023 Filippo Savi
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
import LegendItem from "@components/Views/Emulators/EmulationResults/LegendItem.jsx";
import {ColorTheme} from "@UI";



let ResultPlotLegend = function (props) {


    let produce_legends =() =>{
        let ret = [];
        for(let i=0; i<props.data.length; i++){
            ret.push(
                <LegendItem key={i} size={16} label={props.data[i].name} color={ColorTheme.plot_palette[i%ColorTheme.plot_palette.length]}
            />);
        }
        return ret;
    }

    return(
        <div style={{
            display:"flex",
            flexDirection:"column",
            gap:10,
            paddingTop:"2em",
            height:"100%"
        }}>
            {produce_legends()}
        </div>
    );

};
export default ResultPlotLegend;
