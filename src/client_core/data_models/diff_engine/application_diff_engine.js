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




export class application_diff_engine {


    static diff_application(application_a, application_b){
        let inner_app_a = JSON.parse(JSON.stringify(application_a));
        let inner_app_b = JSON.parse(JSON.stringify(application_b));

        let ret = [];

        ret = [...ret, application_diff_engine.diff_channels(inner_app_a.channels, inner_app_b.channels)];
        delete inner_app_a.channels;
        delete inner_app_b.channels;

        ret = [...ret, application_diff_engine.diff_channel_groups(inner_app_a.channel_groups, inner_app_b.channel_groups)];
        delete inner_app_a.channel_groups;
        delete inner_app_b.channel_groups;

        ret = [...ret, application_diff_engine.diff_irv(inner_app_a.initial_registers_values, inner_app_b.initial_registers_values)];
        delete inner_app_a.initial_registers_values;
        delete inner_app_b.initial_registers_values;

        ret = [...ret, application_diff_engine.diff_macros(inner_app_a.macro, inner_app_b.macro)];
        delete inner_app_a.macro;
        delete inner_app_b.macro;

        ret = [...ret, application_diff_engine.diff_parameters(inner_app_a.parameters, inner_app_b.paraneters)];
        delete inner_app_a.parameters;
        delete inner_app_b.parameters;


        ret = [...ret, application_diff_engine.diff_peripherals(inner_app_a.peripherals, inner_app_b.peripherals)];
        delete inner_app_a.peripherals;
        delete inner_app_b.peripherals;


        ret = [...ret, application_diff_engine.diff_softcores(inner_app_a.soft_cores, inner_app_b.soft_cores)];
        delete inner_app_a.soft_cores;
        delete inner_app_b.soft_cores;

        ret = [...ret, application_diff_engine.diff_programs(inner_app_a.programs, inner_app_b.programs)];
        delete inner_app_a.programs;
        delete inner_app_b.programs;

        ret = [...ret, application_diff_engine.diff_filters(inner_app_a.filters, inner_app_b.filters)];
        delete inner_app_a.filters;
        delete inner_app_b.filters;

        ret = [...ret, application_diff_engine.diff_scripts(inner_app_a.scripts, inner_app_b.scripts)];
        delete inner_app_a.scripts;
        delete inner_app_b.scripts;

        ret = [...ret, application_diff_engine.diff_misc_fields(inner_app_a, inner_app_b)];

        return ret;
    }

    static diff_channels = (a_side, b_side) => {

    }

    static diff_channel_groups = (a_side, b_side) => {

    }

    static diff_irv = (a_side, b_side) => {

    }

    static diff_macros = (a_side, b_side)=> {

    }

    static diff_parameters= (a_side, b_side) => {

    }

    static diff_peripherals = (a_side, b_side) => {

    }

    static diff_softcores = (a_side, b_side) => {

    }

    static diff_filters = (a_side, b_side) => {

    }
    static diff_programs = (a_side, b_side) => {

    }

    static diff_scripts = (a_side, b_side) => {

    }

    static diff_misc_fields = (a_side, b_side) => {

    }

}