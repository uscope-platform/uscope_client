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


export const filter_calculate_keepouts = (filter_type, filter_parameters) =>{
    if(filter_type[2]){
        return [    {
            type: 'rect',
            xref: 'x',
            yref: 'y',
            x0: 0.7,
            y0: 3,
            x1: 1.5,
            y1: 6,
            line: {
                color: 'rgb(55, 128, 191)',
                width: 3
            },
            fillcolor: 'rgba(55, 128, 191, 0.6)'
        }];
    } else{
        return [];
    }

}
