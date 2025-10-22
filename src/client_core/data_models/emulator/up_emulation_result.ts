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
    public timebase:number[];
    public data:any;
    public inputs:any;
    public selected_data_series:any;

    constructor(res_obj: any,  inputs: any) {
        if(!res_obj || JSON.stringify(Object.keys(res_obj)) === JSON.stringify(["timebase"])) {
            console.error("Invalid emulation result");
            this.timebase= [];
            return;
        }
        this.data = res_obj;
        this.timebase = [...res_obj.timebase];
        delete this.data.timebase;
        this.inputs = inputs;
        this.selected_data_series = [];
    }


    static getDummy() {
        let obj = {
            timebase:[],
            data:{}
        }
        return new up_emulator_result(obj, {});
    }
    
    get_timebase = () =>{return this.timebase}

    get_data_sources = () =>{
        if(!this.data) return {sources:[], n_inputs:0};
        let cores = Object.keys(this.data).filter(key=> !["timebase"].includes(key));

        return {sources:[...cores, ...Object.keys(this.inputs)], n_inputs:Object.keys(this.inputs).length};
    }

    get_available_data_series = (series_name: string) =>{
        if(series_name && this.data[series_name].outputs){
            if(this.data.hasOwnProperty(series_name)){
                return Object.keys(this.data[series_name].outputs);
            } else {
                return Object.keys(this.inputs[series_name]);
            }
        } else{
            return [];
        }
    }


    get_series_channels(data_source: string | undefined, data_series: string | undefined){

        if(data_series && data_source && this.data && this.data.hasOwnProperty(data_source) && this.data[data_source].outputs){
            if(this.data[data_source].outputs.hasOwnProperty(data_series)){
                return Object.keys(this.data[data_source].outputs[data_series]);
            }
        }
        return [];
    }

    get_array_indices(data_source:string, data_series: string){
        if(data_series && data_source && this.data && this.data.hasOwnProperty(data_source) && this.data[data_source].outputs){
            if(this.data[data_source].outputs.hasOwnProperty(data_series)){
                let array = this.data[data_source].outputs[data_series][0];
                let res = []
                for(let i = 0; i<array.length; i++){
                    res.push(String(i));
                }
                return res
            }
        }
        return [];
    }

    get_data_series() {
        return [this.timebase, this.selected_data_series];
    }

    add_input(data_source?:string, input_name?:string, is_multiselection?:boolean) {
        if(data_source && input_name){
            if(is_multiselection){
                this.selected_data_series.push({
                    name:data_source + "." + input_name,
                    content:this.inputs[data_source][input_name]
                });
            } else {
                this.selected_data_series =[{
                    name:data_source + "." + input_name,
                    content:this.inputs[data_source][input_name]
                }];
            }
        }
        return [];
    }

    add_data_series(data_source: string, data_series: string, channel: string, index: string, is_multiselection:boolean) {
        if(data_source && data_series && channel &&index){
            let int_channel: number = parseInt((channel as string));
            if(is_multiselection){
                this.selected_data_series.push({
                    name:data_source + "." + data_series + "." + channel + "[" + index + "]",
                    content:this.data[data_source].outputs[data_series][int_channel][index]
                });
            } else {
                this.selected_data_series =[{
                    name:data_source + "." + data_series + "." + channel + "[" + index + "]",
                    content:this.data[data_source].outputs[data_series][int_channel][index]
                }];
            }
        }

    }

}
