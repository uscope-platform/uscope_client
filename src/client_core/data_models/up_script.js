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
import {AddScript, removeScript} from "../../redux/Actions/scriptsActions";

export class up_script {
    constructor(script_obj) {
        this.id = script_obj.id;
        this.name = script_obj.name;
        this.path = script_obj.path;
        this.script_content = script_obj.script_content;
        this.triggers = script_obj.triggers;
    }

    static construct_empty(script_id){
        let script_obj = {id:script_id, name:'new script_'+script_id,path:`new script_${script_id}.js`, script_content:'', triggers:''};
        return new up_script(script_obj);
    }

    add_remote = () => {
        store.dispatch(AddScript(this));
        return backend_post(api_dictionary.scripts.add+'/'+this.id, this._get_script());
    }

    set_content = (content) => {
        return this.edit_field("script_content", content);
    }

    edit_field = (field, value) => {
        this[field] = value;
        store.dispatch(AddScript(this));
        let edit = {script:this.id, field:field, value:value};
        return backend_patch(api_dictionary.scripts.edit+'/'+this.id,edit)
    }

    static delete_script(script){
        return backend_delete(api_dictionary.scripts.delete+'/'+script.id, script).then(()=>{
            store.dispatch(removeScript(script));
        })
    }

    _get_script = () =>{
        return {
                id: this.id,
                path: this.path,
                name: this.name,
                script_content: this.script_content,
                triggers: this.triggers
            };
    }


}
