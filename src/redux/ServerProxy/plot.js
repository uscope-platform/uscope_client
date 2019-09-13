import store from "../../store";
import {loadChanels} from "../Actions/plotActions";
import {fetchData} from "../Actions/plotActions"

export default function plotProxy(server_url) {
    let _this = this;
    this.server_url = server_url;


    this.getChannelsInfo = function () {
        store.dispatch(loadChanels(_this.server_url+'plot/channels/specs'));
    };
    
    this.fetchData = function () {
        const state = store.getState();
        let channels = state.plot.data.map((data)=>{
            return data.visible
        });
        store.dispatch(fetchData(_this.server_url+'plot/channels/data',channels))
    }

}




