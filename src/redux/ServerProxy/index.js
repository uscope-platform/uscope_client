import applicationProxy from "./applications";


export default function serverProxy(server_url) {
    this.server_url = server_url;
    this.app_proxy = new applicationProxy(this.server_url);
}

