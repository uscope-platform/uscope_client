// Copyright 2021 University of Nottingham Ningbo China
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

import store from "../store";
import {addScript, editScript, removeScript} from "../redux/Actions/scriptsActions"

let ScriptsProxy = class{

    upload_script = (script) => {
        let state = store.getState();
        store.dispatch(addScript(state.settings.server_url+'script/'+script.id, script, state.settings.auth_config));
    };

    edit_script = (script) => {
        let state = store.getState();
        store.dispatch(editScript(state.settings.server_url+'script/'+script.id, script, state.settings.auth_config));
    };


    delete_script = (script) => {
        let state = store.getState();
        store.dispatch(removeScript(state.settings.server_url+'script/'+script.id, script, state.settings.auth_config));
    };

}

export default ScriptsProxy;
