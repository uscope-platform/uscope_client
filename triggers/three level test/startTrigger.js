function start_tlt_trigger(parameters, context) {


    let registers = {};
    let ws = {};


    registers['Pwm_Generator.cmp_1l_a'] = 0;
    registers['Pwm_Generator.cmp_2l_a'] = 43;
    registers['Pwm_Generator.cmp_3l_a'] = 49;
    registers['Pwm_Generator.cmp_1h_a'] = 33;
    registers['Pwm_Generator.cmp_2h_a'] = 48;
    registers['Pwm_Generator.cmp_3h_a'] = 97;

    registers['Pwm_Generator.cmp_1l_b'] = 0;
    registers['Pwm_Generator.cmp_2l_b'] = 25;
    registers['Pwm_Generator.cmp_3l_b'] = 40;
    registers['Pwm_Generator.cmp_1h_b'] = 24;
    registers['Pwm_Generator.cmp_2h_b'] = 30;
    registers['Pwm_Generator.cmp_3h_b'] = 97;

    registers['Pwm_Generator.cnt_low_a'] = 0;
    registers['Pwm_Generator.cnt_high_a'] = 96;

    registers['Pwm_Generator.cnt_low_b'] = 0;
    registers['Pwm_Generator.cnt_high_b'] = 96;


    registers['Pwm_Generator.out_en_a'] = 0x3F;
    registers['Pwm_Generator.out_en_b'] = 0x3F;

    registers['Pwm_Generator.ch_ctrl_a'] = 2;
    registers['Pwm_Generator.ch_ctrl_b'] = 2;

    registers['Pwm_Generator.pwm_ctrl'] = 0x2428;

    return {workspace:ws, registers:registers};
}