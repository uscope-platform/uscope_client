import applicationProxy from "./applications";
import peripheralProxy from "./peripheral";
import plotProxy from "./plot";



export default function serverProxy(server_url) {
    this.server_url = server_url;
    this.app_proxy = new applicationProxy(this.server_url);
    this.periph_proxy = new peripheralProxy(this.server_url);
    this.plot_proxy = new plotProxy(this.server_url);
}
