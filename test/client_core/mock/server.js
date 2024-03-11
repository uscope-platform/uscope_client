// Copyright 2021 Filippo Savi
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

import { setupServer } from 'msw/node'
import { cache_handlers } from './cache_handling_api'
import {applications_api} from "./applications_api";
import {bitstreams_api} from "./bitstreams_api";
import {scripts_api} from "./scripts_api";
import {programs_api} from "./programs_api";
import {peripherals_api} from "./peripherals_api";
import {auth_api} from "./auth_api";
import {platform_api} from "./platform_api";
import {plot_api} from "./plot_api";
import {emulators_api} from "./emulators_api";


export const server = setupServer(...cache_handlers, ...applications_api,
    ...bitstreams_api, ...scripts_api, ...programs_api, ...peripherals_api,
    ...auth_api, ...platform_api, ...plot_api, ...emulators_api)