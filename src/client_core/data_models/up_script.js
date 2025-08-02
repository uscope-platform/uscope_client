// Copyright 2021 Filippo Savi
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




import {store} from "../index";
import {backend_delete, backend_patch, backend_post} from "../proxy/backend";
import {api_dictionary} from "../proxy/api_dictionary";
import {AddScript,removeScript} from "@redux";

const default_script_content = `
    function script_main(parameters, context) {
    
        let ws = []; 
        let regs = []; 
        return {workspace:ws, registers:regs};
     
    }
`

export class up_script {
    constructor(script_obj) {
        if(!script_obj)
            return;
        this.id = script_obj.id;
        this.name = script_obj.name;
        this.path = script_obj.path;
        this.content = script_obj.content;
        this.triggers = script_obj.triggers;
    }

    static deep_copy_s =  (old_script) => {
        let ret = {};

        ret.id = old_script.id;
        ret.name = old_script.name;
        ret.path = old_script.path;
        ret.content = old_script.content;
        ret.triggers = old_script.triggers;
        return ret;
    }

    static duplicate = async (old_script, new_id) => {
        let new_script = up_script.deep_copy_s(old_script);
        new_script.id = new_id;
        new_script.name = old_script.name + "_copy_" + new_id;
        return new up_script(new_script);
    }

    static construct_empty(script_id){
        let script_obj = {id:script_id, name:'new script_'+script_id,path:`new script_${script_id}.js`, content:default_script_content, triggers:''};
        return new up_script(script_obj);
    }

    add_remote = () => {
        store.dispatch(AddScript(this));
        return backend_post(api_dictionary.scripts.add+'/'+this.id, this._get_script());
    }

    edit_field = (field, value) => {
        this[field] = value;
        store.dispatch(AddScript(this));
        let edit = {script:this.id, field:field, value:value};
        return backend_patch(api_dictionary.scripts.edit+'/'+this.id,edit)
    }

    static delete(script){
        return backend_delete(api_dictionary.scripts.delete+'/'+script.id, script).then(()=>{
            store.dispatch(removeScript(script));
        })
    }

    get_raw_obj = () => {
        return this._get_script();
    }

    _get_script = () =>{
        return {
                id: this.id,
                path: this.path,
                name: this.name,
                content: this.content,
                triggers: this.triggers
            };
    }


}
