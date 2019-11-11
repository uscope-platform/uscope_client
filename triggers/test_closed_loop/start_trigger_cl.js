function start_trigger_cl(parameters, context) {


    let registers = {};

    let period = 1000;

    let duty = Math.max(period*context.workspace.duty,0.005);
    let deadtime = 50;

    registers['Pwm_Generator.cmp_2l_a'] = duty;
    registers['Pwm_Generator.cmp_3l_a'] = duty+deadtime;
    registers['Pwm_Generator.cmp_2h_a'] = period+1;
    registers['Pwm_Generator.cmp_3h_a'] = period+1;

    registers['Pwm_Generator.cnt_low_a'] = 0;
    registers['Pwm_Generator.cnt_high_a'] = period;

    registers['Pwm_Generator.out_en_a'] = 0x3f;

    registers['Pwm_Generator.ch_ctrl_a'] = 2;


    registers['Pwm_Generator.pwm_ctrl'] = 0x2428;

    return {workspace:null, registers:registers};
}