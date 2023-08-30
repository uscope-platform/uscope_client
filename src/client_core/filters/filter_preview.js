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

    let exclusion_zones = [];
    let limits = []
    if(filter_type[0]){ //  LOW PASS
        limits.push([0, filter_parameters.pass_band_edge_1, -90, -filter_parameters.pass_band_ripple]);
        limits.push([filter_parameters.stop_band_edge_1, filter_parameters.sampling_frequency/2, -filter_parameters.stop_band_attenuation, 0]);
    } else if(filter_type[1]){ //HIGH PASS
        limits.push([0, filter_parameters.pass_band_edge_1, -filter_parameters.stop_band_attenuation, 0]);
        limits.push([filter_parameters.stop_band_edge_1, filter_parameters.sampling_frequency/2, -90, -filter_parameters.pass_band_ripple]);
    } else if(filter_type[2]){ //BAND PASS
        limits.push([0, filter_parameters.stop_band_edge_1, -filter_parameters.stop_band_attenuation, 0]);
        limits.push([filter_parameters.pass_band_edge_1, filter_parameters.pass_band_edge_2, -90, -filter_parameters.pass_band_ripple]);
        limits.push([filter_parameters.stop_band_edge_2, filter_parameters.sampling_frequency/2, -filter_parameters.stop_band_attenuation, 0]);
    } else{ ///BAND STOP
        limits.push([0, filter_parameters.pass_band_edge_1, -90, -filter_parameters.pass_band_ripple]);
        limits.push([filter_parameters.stop_band_edge_1,filter_parameters.stop_band_edge_2, -filter_parameters.stop_band_attenuation, 0]);
        limits.push([filter_parameters.pass_band_edge_2, filter_parameters.sampling_frequency/2, -90, -filter_parameters.pass_band_ripple]);
    }

    for(const l of limits) {
        exclusion_zones.push({
            type: 'rect',
            xref: 'x',
            yref: 'y',
            x0: l[0],
            y0: l[2],
            x1: l[1],
            y1: l[3],
            line: {
                color: 'rgb(55, 128, 191)',
                width: 3
            },
            fillcolor: 'rgba(55, 128, 191, 0.6)'
        })
    }

    return exclusion_zones;
}
