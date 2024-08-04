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


export class up_emulator_result {
    constructor(res_obj,  inputs) {
        if(!res_obj)
            return;
        this.data = res_obj;
        delete this.data.timebase;
        this.inputs = inputs;
        this.timebase = res_obj.timebase;
        this.selected_data_series = [];
    }

    get_timebase = () =>{return this.timebase}

    get_data_sources = () =>{
        let cores = Object.keys(this.data).filter(key=> !["timebase"].includes(key));

        return [...cores, ...Object.keys(this.inputs)];
    }

    get_available_data_series = (series_name) =>{
        if(series_name){
            if(this.data.hasOwnProperty(series_name)){
                return Object.keys(this.data[series_name].outputs);
            } else {
                return Object.keys(this.inputs[series_name]);
            }
        } else{
            return [];
        }
    }

    is_multichannel(data_source, data_series){
        return Object.keys(this.data[data_source][data_series]).length >1;
    }

    get_series_channels(data_source, data_series){
        if(this.data.hasOwnProperty(data_source)){
            if(this.data[data_source].outputs.hasOwnProperty(data_series)){
                return Object.keys(this.data[data_source].outputs[data_series]);
            }
        }
        return [];
    }

    get_data_series() {
        return [this.timebase, this.selected_data_series];
    }


    add_data_series(data_source, data_series, channel, index) {
        this.selected_data_series.push({
            name:data_source + "." + data_series + "." + channel + "[" + index + "]",
            content:this.data[data_source].outputs[data_series][parseInt(channel)][index]
        });
    }

    set_data_series(data_source, data_series, channel, index) {
        this.selected_data_series =[{
            name:data_source + "." + data_series + "." + channel + "[" + index + "]",
            content:this.data[data_source].outputs[data_series][parseInt(channel)][index]
        }];
    }

}
