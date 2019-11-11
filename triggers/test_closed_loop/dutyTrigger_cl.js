function dutyTrigger_cl(parameters, context) {
    let workspace = {};
    workspace['duty'] = parameters;

    let registers = {};

    let deadtime = 50;

    registers['Pwm_Generator.cmp_2l_a'] = parameters;
    registers['Pwm_Generator.cmp_3l_a'] = parameters+deadtime;

    return {workspace:workspace, registers:null};
}