function start_trigger_cl(parameters, context) {


    let registers = {};

    let out_freq = context.workspace.fsw;

    let pwm_clock = 10e6;
    let period = pwm_clock/out_freq;

    registers['Pwm_Generator.cmp_2h_a'] = period+1;
    registers['Pwm_Generator.cmp_3h_a'] = period+1;

    registers['Pwm_Generator.cnt_low_a'] = 0;
    registers['Pwm_Generator.cnt_high_a'] = period;

    registers['Pwm_Generator.out_en_a'] = 0x3f;

    registers['Pwm_Generator.ch_ctrl_a'] = 2;


    registers['Pwm_Generator.pwm_ctrl'] = 0x2428;

    return {workspace:null, registers:registers};
}