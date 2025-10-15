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




import store from "../../store.js";
import {backend_delete, backend_get, backend_patch, backend_post} from "../proxy/backend.js";
import {api_dictionary} from "../proxy/api_dictionary.js";
import {AddFilter, removeFilter} from "#redux/index.js";
import type {filter_specifications} from "#interfaces/index.js";

export class up_filter {
    public id: number;
    public name: string;
    public ideal_taps: number[];
    public quantized_taps: number[];
    public parameters:  Record<string, any>;

    constructor(filter_obj: filter_specifications) {
        this.id = filter_obj.id;
        this.name = filter_obj.name;
        this.parameters = filter_obj.parameters;
        this.ideal_taps = filter_obj.ideal_taps;
        this.quantized_taps = filter_obj.quantized_taps;
    }

    static construct_empty(filter_id: number){
        let filter_obj: filter_specifications = {
            id:filter_id,
            name:'new filter_'+filter_id,
            parameters:{
                type:"lp",
                n_taps:100,
                pass_band_edge_1:0,
                stop_band_edge_1:0,
                pass_band_edge_2:0,
                stop_band_edge_2:0,
                sampling_frequency:0,
                taps_width:16
            },
            ideal_taps:[],
            quantized_taps:[]
        };
        return new up_filter(filter_obj);
    }

    static deep_copy_s =  (old_filter:filter_specifications): filter_specifications => {
        return {
            id: old_filter.id,
            name: old_filter.name,
            parameters: JSON.parse(JSON.stringify(old_filter.parameters)),
            ideal_taps: old_filter.ideal_taps,
            quantized_taps: old_filter.quantized_taps
        };
    }

    static duplicate = async (old_filter: filter_specifications, new_id: number) => {
        let new_filter = up_filter.deep_copy_s(old_filter);
        new_filter.id = new_id;
        new_filter.name = old_filter.name + "_copy_" + new_id;
        return new up_filter(new_filter);
    }


    design = () =>{
        return backend_get(api_dictionary.operations.filter_design + '/' + this.id);
    }
    implement = () =>{
        return backend_get(api_dictionary.operations.filter_implement + '/' + this.id);
    }

    get_plots = () =>{
        return backend_get(api_dictionary.operations.filter_response + '/' + this.id);
    }

    add_remote = () => {
        store.dispatch(AddFilter(this));
        return backend_post(api_dictionary.filters.add+'/'+this.id, this._get_filter());
    }

    edit_parameter = (field: string, value: any) => {
        this.parameters[field] = value;
        store.dispatch(AddFilter(this));
        let edit = {filter:this.id, field:"parameters", value:this.parameters};
        return backend_patch(api_dictionary.filters.edit+'/'+this.id,edit)
    }


    edit_field =<K extends keyof this>(field: K, value: this[K]) => {
        this[field] = value;
        store.dispatch(AddFilter(this));
        let edit = {filter:this.id, field:field, value:value};
        return backend_patch(api_dictionary.filters.edit+'/'+this.id,edit)
    }

    static delete(filter: up_filter){
        return backend_delete(api_dictionary.filters.delete+'/'+filter.id, filter).then(()=>{
            store.dispatch(removeFilter(filter));
        })
    }

    get_raw_obj = () => {
        return this._get_filter();
    }

    _get_filter = () =>{
        return {
                id: this.id,
                name: this.name,
                parameters: this.parameters,
                ideal_taps: this.ideal_taps,
                quantized_taps: this.quantized_taps
            };
    }


}
