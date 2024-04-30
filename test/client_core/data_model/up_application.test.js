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

import {up_application} from "../../../src/client_core";
import {created_app_data, edit_app_data, removed_app} from "../mock/applications_api";
import {mock_store} from "../mock/redux_store";


test("application_creation", () => {
    let app = up_application.construct_empty(1);
    let check_app = {"new application_1": {
            application_name: "new application_1",
            id:1,
            bitstream: '',
            channels: [],
            channel_groups:[],
            clock_frequency: 100000000,
            initial_registers_values: [],
            macro: [],
            parameters: [],
            soft_cores: [],
            peripherals: [],
            filters:[],
            scripts:[],
            programs:[]
        }};
    expect(app._get_app()).toStrictEqual(check_app)
})

test("remote add", () => {
    let app = up_application.construct_empty(1);
    return app.add_remote().then(()=>{
        let check_app = {"new application_1": {
                application_name: "new application_1",
                id:1,
                bitstream: '',
                channels: [],
                channel_groups:[],
                clock_frequency: 100000000,
                initial_registers_values: [],
                macro: [],
                parameters: [],
                soft_cores: [],
                peripherals: [],
                filters:[],
                scripts:[],
                programs:[]
            }};

        expect(created_app_data).toStrictEqual(check_app);
        let state = mock_store.getState();
        expect(state.applications[1]._get_app().default).toStrictEqual(check_app.default)
    })
})

test("add_channel", () => {
    let app = up_application.construct_empty(1);
    return app.add_remote().then(() => {
        return app.add_channel("test_ch").then(() => {
            let check_app = {
                "new application_1": {
                    application_name: "new application_1",
                    id:1,
                    bitstream: '',
                    channels: [{
                        enabled: false,
                        id: "test_ch",
                        max_value: "1000",
                        min_value: "0",
                        mux_setting: 0,
                        name: "test_ch",
                        number: 0,
                        phys_width: 16,
                        scaling_factor: 1,
                        signed:true
                    }],
                    channel_groups: [],
                    clock_frequency: 100000000,
                    initial_registers_values: [],
                    macro: [],
                    soft_cores: [],
                    parameters: [],
                    peripherals: [],
                    filters:[],
                    scripts:[],
                    programs:[]
                }
            };

            expect(edit_app_data).toStrictEqual({
                action: "add_channel", application: 1, channel: {
                    enabled: false,
                    id: "test_ch",
                    max_value: "1000",
                    min_value: "0",
                    mux_setting: 0,
                    name: "test_ch",
                    number: 0,
                    phys_width: 16,
                    scaling_factor: 1,
                    signed:true
                }
            });
            let state = mock_store.getState();
            expect(state.applications[1]._get_app()["new application_1"]).toStrictEqual(check_app["new application_1"]);
        });

    });
});

test("add_channel_group", () => {
    let app = up_application.construct_empty(1);
    return app.add_remote().then(() => {
        return app.add_channel_group("test_chg").then(() => {
            let check_app = {
                "new application_1": {
                    application_name: "new application_1",
                    bitstream: '',
                    channels: [],
                    channel_groups: [{
                        group_id:"test_chg",
                        group_name:"test_chg",
                        channels:[],
                        "default":false
                    }],
                    clock_frequency: 100000000,
                    initial_registers_values: [],
                    macro: [],
                    parameters: [],
                    peripherals: [],
                    soft_cores: [],
                    filters:[],
                    scripts:[],
                    programs:[]
                }
            };

            expect(edit_app_data).toStrictEqual({
                action: "add_channel_group", application: 1, group: {
                    group_id:"test_chg",
                    group_name:"test_chg",
                    channels:[],
                    "default":false
                }
            });
            let state = mock_store.getState();
            expect(state.applications[1]._get_app().default).toStrictEqual(check_app.default);
        });

    });
});

test("add_irv", () => {
    let app = up_application.construct_empty(1);
    return app.add_remote().then(() => {
        return app.add_irv("0x543245").then(() => {
            let check_app = {
                "new application_1": {
                    application_name: "new application_1",
                    bitstream: '',
                    id:1,
                    channels: [],
                    channel_groups: [],
                    clock_frequency: 100000000,
                    initial_registers_values: [{
                        address:"0x543245",
                        value:"0"
                    }],
                    macro: [],
                    parameters: [],
                    soft_cores: [],
                    peripherals: [],
                    filters:[],
                    scripts:[],
                    programs:[]
                }
            };

            expect(edit_app_data).toStrictEqual({
                action: "add_irv", application: 1, irv: {
                    address:"0x543245",
                    value:"0"
                }
            });
            let state = mock_store.getState();
            expect(state.applications[1]._get_app()["new application_1"]).toStrictEqual(check_app["new application_1"]);
        });

    });
});

test("add_macro", () => {
    let app = up_application.construct_empty(1);
    return app.add_remote().then(() => {
        return app.add_macro("test_macro").then(() => {
            let check_app = {
                "new application_1": {
                    application_name: "new application_1",
                    bitstream: '',
                    channels: [],
                    channel_groups: [],
                    clock_frequency: 100000000,
                    initial_registers_values: [],
                    macro: [{
                        name:"test_macro",
                        trigger:""
                    }],
                    parameters: [],
                    soft_cores: [],
                    peripherals: [],
                    filters:[],
                    scripts:[],
                    programs:[]
                }
            };

            expect(edit_app_data).toStrictEqual({
                action: "add_macro", application: 1, macro: {
                    name:"test_macro",
                    trigger:""
                }
            });
            let state = mock_store.getState();
            expect(state.applications[1]._get_app().default).toStrictEqual(check_app.default);
        });

    });
});

test("add_parameter", () => {
    let app = up_application.construct_empty(1);
    return app.add_remote().then(() => {
        return app.add_parameter("test_param").then(() => {
            let check_app = {
                "new application_1": {
                    application_name: "new application_1",
                    id:1,
                    bitstream: '',
                    channels: [],
                    channel_groups: [],
                    clock_frequency: 100000000,
                    initial_registers_values: [],
                    macro: [],
                    soft_cores: [],
                    parameters: [{
                        parameter_id:"test_param",
                        parameter_name:"test_param",
                        trigger:"",
                        value:"0",
                        visible:false
                    }],
                    peripherals: [],
                    filters:[],
                    scripts:[],
                    programs:[]
                }
            };

            expect(edit_app_data).toStrictEqual({
                action: "add_parameter", application: 1, parameter: {
                    parameter_id:"test_param",
                    parameter_name:"test_param",
                    trigger:"",
                    value:"0",
                    visible:false
                }
            });
            let state = mock_store.getState();
            expect(state.applications[1]._get_app()["new application_1"]).toStrictEqual(check_app["new application_1"]);
        });

    });
});

test("add_peripheral", () => {
    let app = up_application.construct_empty(1);
    return app.add_remote().then(() => {
        return app.add_peripheral("test_periph").then(() => {
            let check_app = {
                "new application_1": {
                    application_name: "new application_1",
                    id:1,
                    bitstream: '',
                    channels: [],
                    channel_groups: [],
                    clock_frequency: 100000000,
                    initial_registers_values: [],
                    macro: [],
                    soft_cores: [],
                    filters:[],
                    scripts:[],
                    programs:[],
                    parameters: [],
                    peripherals: [{
                        base_address:"0",
                        name: "test_periph",
                        peripheral_id:"test_periph",
                        proxied:false,
                        hdl_parameters: {},
                        spec_id:"",
                        proxy_address:"0",
                        type:"Registers"
                    }]
                }
            };

            expect(edit_app_data).toStrictEqual({
                action: "add_peripheral", application: 1, peripheral: {
                    base_address:"0",
                    name: "test_periph",
                    peripheral_id:"test_periph",
                    proxied:false,
                    hdl_parameters: {},
                    spec_id:"",
                    proxy_address:"0",
                    type:"Registers"
                }
            });
            let state = mock_store.getState();
            expect(state.applications[1]._get_app()["new application_1"]).toStrictEqual(check_app["new application_1"]);
        });

    });
});


test("add_soft_core", () => {
    let app = up_application.construct_empty(1);
    return app.add_remote().then(() => {
        return app.add_soft_core("test_core").then(() => {
            let check_app = {
                "new application_1": {
                    application_name: "new application_1",
                    id:1,
                    bitstream: '',
                    channels: [],
                    channel_groups: [],
                    clock_frequency: 100000000,
                    initial_registers_values: [],
                    macro: [],
                    soft_cores: [{
                        id:"test_core",
                        address: 0,
                        default_program:"",
                        io:[]
                    }],
                    parameters: [],
                    peripherals: [],
                    filters:[],
                    scripts:[],
                    programs:[]
                }
            };

            expect(edit_app_data).toStrictEqual({
                action: "add_soft_core", application: 1, soft_core: {
                    id:"test_core",
                    address: 0,
                    default_program:"",
                    io:[]
                }
            });
            let state = mock_store.getState();
            expect(state.applications[1]._get_app().default).toStrictEqual(check_app.default);
        });

    });
});


test("set_misc_periph", () => {
    let app = up_application.construct_empty(1);
    return app.add_remote().then(() => {
        return app.set_misc_param("test_param").then(() => {
            let check_app = {
                "new application_1": {
                    application_name: "new application_1",
                    bitstream: '',
                    channels: [],
                    channel_groups: [],
                    clock_frequency: 100000000,
                    initial_registers_values: [],
                    macro: [],
                    parameters: [],
                    peripherals: [],
                    soft_cores: [],
                    filters:[],
                    scripts:[],
                    programs:[],
                    test_param:0,
                }
            };

            expect(edit_app_data).toStrictEqual({
                action: "add_misc", application: 1, field: {
                    name:"test_param",
                    value:"0"
                }
            });
            let state = mock_store.getState();
            expect(state.applications[1]._get_app().default).toStrictEqual(check_app.default);
        });

    });
});


test("edit_channel", () => {
    let app = up_application.construct_empty(1);
    return app.add_remote().then(() => {
        return app.add_channel("test_ch").then(()=>{
            return app.edit_channel("test_ch", "number", 25).then(() => {
                let check_app = {
                    "new application_1": {
                        application_name: "new application_1",
                        bitstream: '',
                        id:1,
                        channels: [{
                            enabled: false,
                            id: "test_ch",
                            max_value: "1000",
                            min_value: "0",
                            mux_setting: 0,
                            name: "test_ch",
                            number: 25,
                            phys_width: 16,
                            scaling_factor: 1,
                            signed:true
                        }],
                        channel_groups: [],
                        clock_frequency: 100000000,
                        initial_registers_values: [],
                        macro: [],
                        parameters: [],
                        peripherals: [],
                        soft_cores: [],
                        filters:[],
                        scripts:[],
                        programs:[]
                    }
                };

                expect(edit_app_data).toStrictEqual({action: "edit_channel", application: 1,channel:"test_ch", field:"number", value:25});
                let state = mock_store.getState();
                expect(state.applications[1]._get_app()["new application_1"]).toStrictEqual(check_app["new application_1"]);
            });
        })
    });
});

test("edit_channel_group", () => {
    let app = up_application.construct_empty(1);
    return app.add_remote().then(() => {
        return app.add_channel_group("test_chg").then(() => {
            return app.edit_channel_group("test_chg", "channels", [{test:"obj", id:3}]).then(() => {
                let check_app = {
                    "new application_1": {
                        application_name: "new application_1",
                        bitstream: '',
                        id:1,
                        channels: [],
                        channel_groups: [{
                            group_id:"test_chg",
                            group_name:"test_chg",
                            channels:[{test:"obj", id:3}],
                            "default":false
                        }],
                        clock_frequency: 100000000,
                        initial_registers_values: [],
                        macro: [],
                        parameters: [],
                        peripherals: [],
                        soft_cores: [],
                        filters:[],
                        scripts:[],
                        programs:[]
                    }
                };

                expect(edit_app_data).toStrictEqual({action: "edit_channel_group", application: 1,group:"test_chg", field:"channels", value:[{test:"obj", id:3}]});
                let state = mock_store.getState();
                expect(state.applications[1]._get_app()["new application_1"]).toStrictEqual(check_app["new application_1"]);
            });
        });

    });
});

test("edit_irv", () => {
    let app = up_application.construct_empty(1);
    return app.add_remote().then(() => {
        return app.add_irv("0x543245").then(() => {
            return app.edit_irv("0x543245", "address", "0x157").then(() => {
                let check_app = {
                    "new application_1": {
                        application_name: "new application_1",
                        bitstream: '',
                        id:1,
                        channels: [],
                        channel_groups: [],
                        clock_frequency: 100000000,
                        initial_registers_values: [{
                            address:"0x157",
                            value:"0"
                        }],
                        macro: [],
                        parameters: [],
                        peripherals: [],
                        soft_cores: [],
                        filters:[],
                        scripts:[],
                        programs:[]
                    }
                };

                expect(edit_app_data).toStrictEqual({action: "edit_irv", application: 1, address:"0x543245", field:"address", value:"0x157"});
                let state = mock_store.getState();
                expect(state.applications[1]._get_app()["new application_1"]).toStrictEqual(check_app["new application_1"]);
            });


        });

    });
});

test("edit_macro", () => {
    let app = up_application.construct_empty(1);
    return app.add_remote().then(() => {
        return app.add_macro("test_macro").then(() => {
            return app.edit_macro("test_macro", "name", "macro_2").then(() => {
                let check_app = {
                    "new application_1": {
                        application_name: "new application_1",
                        bitstream: '',
                        channels: [],
                        id:1,
                        channel_groups: [],
                        clock_frequency: 100000000,
                        initial_registers_values: [],
                        macro: [{
                            name: "macro_2",
                            trigger: ""
                        }],
                        parameters: [],
                        peripherals: [],
                        filters:[],
                        scripts:[],
                        programs:[],
                        soft_cores: []
                    }
                };

                expect(edit_app_data).toStrictEqual({
                    action: "edit_macro", application: 1, name:"test_macro", field:"name", value:"macro_2"});
                let state = mock_store.getState();
                expect(state.applications[1]._get_app()["new application_1"]).toStrictEqual(check_app["new application_1"]);
            });
        });

    });
});

test("edit_parameter", () => {
    let app = up_application.construct_empty(1);
    return app.add_remote().then(() => {
        return app.add_parameter("test_param").then(() => {
            return app.edit_parameters("test_param", "trigger", "test").then(() => {
                let check_app = {
                    "new application_1": {
                        application_name: "new application_1",
                        bitstream: '',
                        channels: [],
                        id:1,
                        channel_groups: [],
                        clock_frequency: 100000000,
                        initial_registers_values: [],
                        macro: [],
                        parameters: [{
                            parameter_id: "test_param",
                            parameter_name: "test_param",
                            trigger: "test",
                            value: "0",
                            visible: false
                        }],
                        peripherals: [],
                        filters:[],
                        scripts:[],
                        programs:[],
                        soft_cores: []
                    }
                };

                expect(edit_app_data).toStrictEqual({ action: "edit_parameter", application: 1,
                    parameter:"test_param", field:"trigger", value:"test"});
                let state = mock_store.getState();
                expect(state.applications[1]._get_app()["new application_1"]).toStrictEqual(check_app["new application_1"]);
            });
        });

    });
});

test("edit_soft_core", () => {
    let app = up_application.construct_empty(1);
    return app.add_remote().then(() => {
        return app.add_soft_core("test_core").then(() => {
            return app.edit_soft_core("test_core", "default_program", "test_program").then(() => {
                let check_app = {
                    "new application_1": {
                        application_name: "new application_1",
                        bitstream: '',
                        channels: [],
                        id:1,
                        channel_groups: [],
                        clock_frequency: 100000000,
                        initial_registers_values: [],
                        macro: [],
                        soft_cores: [{
                            id:"test_core",
                            address: 0,
                            default_program:"test_program",
                            io:[]
                        }],
                        parameters: [],
                        peripherals: [],
                        filters:[],
                        scripts:[],
                        programs:[]
                    }
                };

                expect(edit_app_data).toStrictEqual({ action: "edit_soft_core", application: 1,
                    core:"test_core", field:"default_program", value:"test_program"});
                let state = mock_store.getState();
                expect(state.applications[1]._get_app().default).toStrictEqual(check_app.default);
            });
        });

    });
});

test("edit_misc_param_value", () => {
    let app = up_application.construct_empty(1);
    return app.add_remote().then(() => {
        return app.set_misc_param("test_param").then(() => {
            return app.edit_misc_param("test_param",52, false).then(() => {
                let check_app = {
                    "new application_1": {
                        application_name: "new application_1",
                        bitstream: '',
                        id:1,
                        channels: [],
                        channel_groups: [],
                        clock_frequency: 100000000,
                        initial_registers_values: [],
                        macro: [],
                        parameters: [],
                        soft_cores: [],
                        peripherals: [],
                        filters:[],
                        scripts:[],
                        programs:[],
                        test_param: 52,
                    }
                };

                expect(edit_app_data).toStrictEqual({
                    action: "edit_misc", application: 1, field:{old_name:null, name:"test_param", value:52}
                });
                let state = mock_store.getState();
                expect(state.applications[1]._get_app().default).toStrictEqual(check_app.default);
            });
        });
    });
});


test("edit_misc_rename", () => {
    let app = up_application.construct_empty(1);
    return app.add_remote().then(() => {
        return app.set_misc_param("test_param").then(() => {
            return app.edit_misc_param("test_param","test_2", true).then(() => {
                let check_app = {
                    "new application_1": {
                        application_name: "new application_1",
                        bitstream: '',
                        id:1,
                        channels: [],
                        channel_groups: [],
                        clock_frequency: 100000000,
                        initial_registers_values: [],
                        macro: [],
                        parameters: [],
                        soft_cores: [],
                        peripherals: [],
                        filters:[],
                        scripts:[],
                        programs:[],
                        test_2: 0,
                    }
                };

                expect(edit_app_data).toStrictEqual({
                    action: "edit_misc", application: 1, field:{old_name:"test_param", name:"test_2"}
                });
                let state = mock_store.getState();
                expect(state.applications[1]._get_app().default).toStrictEqual(check_app.default);
            });
        });
    });
});



test("remove_channel", () => {
    let app = up_application.construct_empty(1);
    return app.add_remote().then(() => {
        return app.add_channel("test_ch").then(() => {
            return app.remove_channel("test_ch").then(() => {
                let check_app = {
                    "new application_1": {
                        application_name: "new application_1",
                        id:1,
                        bitstream: '',
                        channels: [],
                        channel_groups: [],
                        clock_frequency: 100000000,
                        initial_registers_values: [],
                        macro: [],
                        parameters: [],
                        soft_cores: [],
                        peripherals: [],
                        filters:[],
                        scripts:[],
                        programs:[]
                    }
                };

                expect(edit_app_data).toStrictEqual({
                    action: "remove_channel", application: 1, channel: "test_ch"
                });

                let state = mock_store.getState();
                expect(state.applications[1]._get_app()["new application_1"]).toStrictEqual(check_app["new application_1"]);
            });
        });

    });
});

test("remove_channel_group", () => {
    let app = up_application.construct_empty(1);
    return app.add_remote().then(() => {
        return app.add_channel_group("test_chg").then(() => {
            return app.remove_channel_groups("test_chg").then(() => {
                let check_app = {
                    "new application_1": {
                        application_name: "new application_1",
                        id:1,
                        bitstream: '',
                        channels: [],
                        channel_groups: [],
                        clock_frequency: 100000000,
                        initial_registers_values: [],
                        macro: [],
                        parameters: [],
                        soft_cores: [],
                        peripherals: [],
                        filters:[],
                        scripts:[],
                        programs:[]
                    }
                };

                expect(edit_app_data).toStrictEqual({action: "remove_channel_group",
                    application: 1, group: "test_chg"});
                let state = mock_store.getState();
                expect(state.applications[1]._get_app()["new application_1"]).toStrictEqual(check_app["new application_1"]);
            });
        });
    });
});

test("remove_irv", () => {
    let app = up_application.construct_empty(1);
    return app.add_remote().then(() => {
        return app.add_irv("0x543245").then(() => {
            return app.remove_irv("0x543245").then(() => {
                let check_app = {
                    "new application_1": {
                        application_name: "new application_1",
                        id:1,
                        bitstream: '',
                        channels: [],
                        channel_groups: [],
                        clock_frequency: 100000000,
                        initial_registers_values: [],
                        macro: [],
                        parameters: [],
                        soft_cores: [],
                        peripherals: [],
                        filters:[],
                        scripts:[],
                        programs:[]
                    }
                };

                expect(edit_app_data).toStrictEqual({
                    action: "remove_irv", application: 1, address: "0x543245"
                });
                let state = mock_store.getState();
                expect(state.applications[1]._get_app().default).toStrictEqual(check_app.default);
            });
        });

    });
});

test("remove_macro", () => {
    let app = up_application.construct_empty(1);
    return app.add_remote().then(() => {
        return app.add_macro("test_macro").then(() => {
            return app.remove_macro("test_macro").then(() => {
                let check_app = {
                    "new application_1": {
                        application_name: "new application_1",
                        id:1,
                        bitstream: '',
                        channels: [],
                        channel_groups: [],
                        clock_frequency: 100000000,
                        initial_registers_values: [],
                        macro: [],
                        parameters: [],
                        soft_cores: [],
                        peripherals: [],
                        filters:[],
                        scripts:[],
                        programs:[]
                    }
                };

                expect(edit_app_data).toStrictEqual({
                    action: "remove_macro", application: 1, name: "test_macro"
                });
                let state = mock_store.getState();
                expect(state.applications[1]._get_app()["new application_1"]).toStrictEqual(check_app["new application_1"]);
            });
        });
    });
});

test("remove_parameter", () => {
    let app = up_application.construct_empty(1);
    return app.add_remote().then(() => {
        return app.add_parameter("test_param").then(() => {
            return app.remove_parameter("test_param").then(() => {
                let check_app = {
                    "new application_1": {
                        application_name: "new application_1",
                        id:1,
                        bitstream: '',
                        channels: [],
                        channel_groups: [],
                        clock_frequency: 100000000,
                        initial_registers_values: [],
                        macro: [],
                        parameters: [],
                        soft_cores: [],
                        peripherals: [],
                        filters:[],
                        scripts:[],
                        programs:[]
                    }
                };

                expect(edit_app_data).toStrictEqual({
                    action: "remove_parameter", application: 1, parameter: "test_param"
                });
                let state = mock_store.getState();
                expect(state.applications[1]._get_app()["new application_1"]).toStrictEqual(check_app["new application_1"]);
            });
        });
    });
});

test("remove_peripheral", () => {
    let app = up_application.construct_empty(1);
    return app.add_remote().then(() => {
        return app.add_peripheral("test_periph").then(() => {
            return app.remove_peripheral("test_periph").then(() => {
                let check_app = {
                    "new application_1": {
                        application_name: "new application_1",
                        id:1,
                        bitstream: '',
                        channels: [],
                        channel_groups: [],
                        clock_frequency: 100000000,
                        initial_registers_values: [],
                        macro: [],
                        soft_cores: [],
                        parameters: [],
                        peripherals: [],
                        filters:[],
                        scripts:[],
                        programs:[]
                    }
                };

                expect(edit_app_data).toStrictEqual({
                    action: "remove_peripheral", application: 1, peripheral: "test_periph"
                });
                let state = mock_store.getState();
                expect(state.applications[1]._get_app()["new application_1"]).toStrictEqual(check_app["new application_1"]);
            });
        });
    });
});

test("remove_misc_param", () => {
    let app = up_application.construct_empty(1);
    return app.add_remote().then(() => {
        return app.set_misc_param("test_param").then(() => {
            return app.remove_misc_field("test_param").then(() => {
                let check_app = {
                    "new application_1": {
                        application_name: "new application_1",
                        id:1,
                        bitstream: '',
                        channels: [],
                        channel_groups: [],
                        clock_frequency: 100000000,
                        initial_registers_values: [],
                        macro: [],
                        parameters: [],
                        soft_cores: [],
                        peripherals: [],
                        filters:[],
                        scripts:[],
                        programs:[]
                    }
                };

                expect(edit_app_data).toStrictEqual({
                    action: "remove_misc", application: 1, field: {
                        name:"test_param"
                    }
                });
                let state = mock_store.getState();
                expect(state.applications[1]._get_app().default).toStrictEqual(check_app.default);
            });
        });
    });
});


test("application_removal", () => {
    let app = up_application.construct_empty(1);
    return app.add_remote().then(() => {
        up_application.delete(app).then(()=>{
            let state = mock_store.getState();
            expect(state.applications).not.toHaveProperty("new application_1");
            expect(removed_app).toBe("1");
        });
    });
})
