import store from "../store";
import { fetchData, loadChanels, setChannelStatus} from "../redux/Actions/plotActions";
import axios from "axios";

let plotProxy = class{
    constructor(server_url, token) {
        this.server_url = server_url;
        this.config = {headers: { Authorization: `Bearer ${token}` }};
    }

    getChannelsInfo = () => {
        store.dispatch(loadChanels(this.server_url+'plot/channels/specs',this.config));
    };

    fetchData = () =>  {
        store.dispatch(fetchData(this.server_url+'plot/channels/data',this.config))
    };


    setCapture =  (capture_lenght) =>  {
        axios.post(this.server_url+'plot/capture', {length: capture_lenght}, this.config).then(res => {
            return res;
        }).catch(err => {
            alert(err.message);
        });
    };

    get_captured_data = () =>{
        return new Promise((resolve, reject) => {
            axios.get(this.server_url+'/plot/capture', this.config).then(res =>{
                resolve(res.data);
            }).catch(err=>{
                reject(err.message);
            })
        });
    }

    set_channel_status = (channel) => {
        store.dispatch(setChannelStatus(this.server_url+'plot/channels/status',channel, this.config));
    }

    set_channel_widths = (widths) => {
        axios.post(this.server_url+'plot/channels/widths', {widths}, this.config).then(res => {
            return res;
        }).catch(err => {
            alert(err.message);
        });
    }

}


export default plotProxy;


