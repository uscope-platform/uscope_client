function stop_trigger(parameters, context) {

    let registers = {};



    registers['Pwm_Generator.out_en_a'] = 0x0;
    registers['Pwm_Generator.out_en_b'] = 0x0;

    registers['Pwm_Generator.pwm_ctrl'] = 0x2408;

    return {workspace:null, registers:registers};
}