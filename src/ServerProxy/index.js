import applicationProxy from "./applications";
import peripheralProxy from "./peripheral";
import plotProxy from "./plot";
import creatorProxy from "./creator";
import scriptsProxy from "./scripts"
import authProxy from "./auth"
import programsProxy from "./programs";
import platformProxy from "./platform";
export default function serverProxy(server_url, token) {
    this.server_url = server_url;
    this.app_proxy = new applicationProxy(this.server_url, token);
    this.periph_proxy = new peripheralProxy(this.server_url, token);
    this.plot_proxy = new plotProxy(this.server_url, token);
    this.creator_proxy = new creatorProxy(this.server_url, token);
    this.script_proxy = new scriptsProxy(this.server_url, token);
    this.auth_proxy = new authProxy(this.server_url, token);
    this.prog_proxy = new programsProxy(this.server_url, token);
    this.platform_proxy = new platformProxy(this.server_url, token);
}

