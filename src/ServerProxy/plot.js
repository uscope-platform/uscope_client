import store from "../store";
import { fetchData, loadChanels, setChannelStatus} from "../redux/Actions/plotActions";
import axios from "axios";

export default function plotProxy(server_url, token) {
    let _this = this;
    this.server_url = server_url;
    this.config = {headers: { Authorization: `Bearer ${token}` }};

    this.getChannelsInfo = function () {
        store.dispatch(loadChanels(_this.server_url+'plot/channels/specs',_this.config));
    };
    
    this.fetchData = function () {
        store.dispatch(fetchData(_this.server_url+'plot/channels/data',_this.config))
    };


    this.setCapture = function (capture_lenght) {
        axios.post(_this.server_url+'plot/capture', {length: capture_lenght}, _this.config).then(res => {
            return res;
        }).catch(err => {
            alert(err.message);
        });
    };

    this.get_captured_data = () =>{
        return new Promise((resolve, reject) => {
            axios.get(_this.server_url+'/plot/capture', _this.config).then(res =>{
                resolve(res.data);
            }).catch(err=>{
                reject(err.message);
            })
        });
    }

    this.set_channel_status = (channel) => {
        store.dispatch(setChannelStatus(_this.server_url+'plot/channels/status',channel,_this.config));
    }

    this.set_channel_widths = (widths) => {
        axios.post(_this.server_url+'plot/channels/widths', {widths}, _this.config).then(res => {
            return res;
        }).catch(err => {
            alert(err.message);
        });
    }
}




