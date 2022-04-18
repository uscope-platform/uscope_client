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

import PeripheralProxy from "./peripheral";
import PlotProxy from "./plot";
import CreatorProxy from "./creator";
import ScriptsProxy from "./scripts"
import AuthProxy from "./auth"
import ProgramsProxy from "./programs";
import PlatformProxy from "./platform";
import BitstreamsProxy from "./bitstreams"

export default function serverProxy() {
    this.periph_proxy = new PeripheralProxy();
    this.plot_proxy = new PlotProxy();
    this.creator_proxy = new CreatorProxy();
    this.script_proxy = new ScriptsProxy();
    this.auth_proxy = new AuthProxy();
    this.prog_proxy = new ProgramsProxy();
    this.platform_proxy = new PlatformProxy();
    this.bitstream_proxy = new BitstreamsProxy();
}

