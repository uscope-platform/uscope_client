import ApplicationProxy from "./applications";
import PeripheralProxy from "./peripheral";
import PlotProxy from "./plot";
import CreatorProxy from "./creator";
import ScriptsProxy from "./scripts"
import AuthProxy from "./auth"
import ProgramsProxy from "./programs";
import PlatformProxy from "./platform";


export default function serverProxy() {
    this.app_proxy = new ApplicationProxy();
    this.periph_proxy = new PeripheralProxy();
    this.plot_proxy = new PlotProxy();
    this.creator_proxy = new CreatorProxy();
    this.script_proxy = new ScriptsProxy();
    this.auth_proxy = new AuthProxy();
    this.prog_proxy = new ProgramsProxy();
    this.platform_proxy = new PlatformProxy();
}

