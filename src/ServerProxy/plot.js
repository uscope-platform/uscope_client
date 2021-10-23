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
import { fetchData, loadChanels, setChannelStatus} from "../redux/Actions/plotActions";
import axios from "axios";

let PlotProxy = class{

    getChannelsInfo = (loading_done_handler) => {
        let state = store.getState();
        axios.get(state.settings.server_url+'plot/channels/specs', state.settings.auth_config).then(res => {
            store.dispatch(loadChanels(res.data));
            loading_done_handler();
        }).catch(err => {
            console.log(err)
            alert('ERROR: error while loading channels info\n' + err.message);
        });
    };

    fetchData = () =>  {
        let state = store.getState();
        store.dispatch(fetchData(state.settings.server_url+'plot/channels/data',state.settings.auth_config))
    };


    setCapture =  (capture_lenght) =>  {
        let state = store.getState();
        axios.post(state.settings.server_url+'plot/capture', {length: capture_lenght}, state.settings.auth_config).then(res => {
            return res;
        }).catch(err => {
            alert('ERROR: error while setting up capture\n' + err.message);
        });
    };

    get_captured_data = () =>{
        return new Promise((resolve, reject) => {
            let state = store.getState();
            axios.get(state.settings.server_url+'/plot/capture', state.settings.auth_config).then(res =>{
                resolve(res.data);
            }).catch(err=>{
                reject(err.message);
            })
        });
    }

    set_channel_status = (channel) => {
        let state = store.getState();
        store.dispatch(setChannelStatus(state.settings.server_url+'plot/channels/status',channel, state.settings.auth_config));
    }

    set_channel_widths = (widths) => {
        let state = store.getState();
        axios.post(state.settings.server_url+'plot/channels/widths', {widths}, state.settings.auth_config).then(res => {
            return res;
        }).catch(err => {
            alert('ERROR: error while setting up channel widths\n' + err.message);
        });
    }

}


export default PlotProxy;


