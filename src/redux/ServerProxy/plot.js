import store from "../../store";
import {loadChanels} from "../Actions/ChannelStatusActions";

export default function plotProxy(server_url) {
    let _this = this;
    this.server_url = server_url;


    this.getChannelsInfo = function () {
        store.dispatch(loadChanels(_this.server_url+'plot/channels/specs'));
    };

}




