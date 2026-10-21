// Copyright 2023 Filippo Savi
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


export {diff_applications} from './application_diff_engine.js'
export type {application_diff_context} from './application_diff_engine.js'
export {diff_peripherals, diff_is_empty, peripheral_diff_report} from './peripheral_diff_engine.js'
export type {
    field_change,
    register_change,
    peripheral_diff
} from './peripheral_diff_engine.js'
export {report_is_empty} from './diff_common.js'
export type {
    change_kind,
    property_change,
    diff_entry,
    diff_section,
    diff_report
} from './diff_common.js'
