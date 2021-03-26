import store from "../store";
import { fetchData, loadChanels, setChannelStatus} from "../redux/Actions/plotActions";
import axios from "axios";

let PlotProxy = class{

    getChannelsInfo = () => {
        let state = store.getState();
        store.dispatch(loadChanels(state.settings.server_url+'plot/channels/specs',state.settings.auth_config));
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
            alert(err.message);
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
            alert(err.message);
        });
    }

}


export default PlotProxy;


