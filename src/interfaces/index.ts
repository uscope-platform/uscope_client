/*
 * Copyright(c) 2025. Filippo Savi
 * Author: Filippo Savi <filssavi@gmail.com>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */


export type {script, script_edit} from './client_core/script.ts'
export type {program, program_edit} from './client_core/program.ts'
export type {application, group_channel_token, initial_register_value, core_load_info, clock_frequencies, channel, macro, parameter, peripheral_instance, filter, channel_group, soft_core} from './client_core/application.ts'
export type {hil_address_map, emulator,core_options,core_input_source, core, connection, server_side_port_link, hil_data_point, core_deployment_options, core_input, core_input_data, core_memory, core_output, emulator_hil_sim_data, port_link} from './client_core/emulator.ts'
export type {filter_specifications} from './client_core/filter.ts'
export type {bitstream_model} from './client_core/bitstream.ts'
export type {register, peripheral, field} from './client_core/peripherals.ts'
export type {autocomplete_periph_object, register_write_object, autocomplete_suggestion, autocompletion_context} from './client_core/scripting/types.js'
export type {register_write, scope_control, scope_data_object, scope_settings,user_create_request,auth_request, user_model, ScopeStatus} from './client_core/proxy/types.js'
export type {plot_channel} from './plot_view.js'
export type {ApplicationsState, ScriptState,parameter_save_action, BitstreamState, FilterState,ProgramState,EmulatorState,
            PeripheralsState,register_field_upsert_action, register_register_upsert_action, remove_register_action, remove_field_action} from './redux.js'
export type {EmulatorSelections, EmulatorIomSelector, EmulatorGraphEdge, EmulatorComponentSelector, EmulatorGraphNode, EmulatorResultLegendItem} from './emulator_view.js'

export type {DefaultOption, SimpleStringOption, SimpleNumberOption} from './UI/select.js'