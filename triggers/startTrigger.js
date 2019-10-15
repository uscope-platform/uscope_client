function start_trigger(parameters, context) {

    /* before starting to calculate the register settings I need to find out what is the best clock prescaler to use,
    *  given the clock frequency I'm running at*/

    let prescaler_options = [4, 8, 16, 32];
    let pwm_counter_res = 16;
    let period = context.workspace.period;

    let prescaler_value = null;
    let counter_frequency = null;
    for(prescaler_value of prescaler_options){
        counter_frequency = context.parameters['clk_freq']/prescaler_value;
        if((1/counter_frequency)*Math.pow(2, pwm_counter_res) > period){
            break;
        }
    }

    let counter_start = 0;
    let counter_stop = Math.round(2*period*counter_frequency);


    /* first the values are converted to percentages of a single period*/
    let ls_off_mid_norm = context.workspace.low_side_turn_off_mid/period;
    let ls_off_neg_norm = context.workspace.low_side_turn_off_neg/period;
    let ls_on_mid_norm = context.workspace.low_side_turn_on_mid/period;
    let ls_on_full_norm = context.workspace.low_side_turn_on_full/period;

    let hs_off_mid_norm = context.workspace.high_side_turn_off_mid/period;
    let hs_off_neg_norm = context.workspace.high_side_turn_off_neg/period;
    let hs_on_mid_norm = context.workspace.high_side_turn_on_mid/period;
    let hs_on_full_norm = context.workspace.high_side_turn_on_full/period;

    /* then they are converted to the proper value the pwm generator is expecting by multiplying them with the full scale
    // and rounded to the nearest integer*/
    let ls_off_mid = Math.round(ls_off_mid_norm*counter_stop);
    let ls_off_neg = Math.round(ls_off_neg_norm*counter_stop);
    let ls_on_mid = Math.round(ls_on_mid_norm*counter_stop);
    let ls_on_full = Math.round(ls_on_full_norm*counter_stop);

    let hs_off_mid = Math.round(hs_off_mid_norm*counter_stop);
    let hs_off_neg = Math.round(hs_off_neg_norm*counter_stop);
    let hs_on_mid = Math.round(hs_on_mid_norm*counter_stop);
    let hs_on_full = Math.round(hs_on_full_norm*counter_stop);

    let registers = {};
    let ws = {};

   /*
    *   Channel 1 of each chain controls the full voltage
    *   Channel 2 controls the mid level turn on and turn off
    */


    registers['Pwm_Generator.cmp_1l_a'] = ls_off_mid;
    registers['Pwm_Generator.cmp_2l_a'] = ls_off_neg;
    registers['Pwm_Generator.cmp_2h_a'] = ls_on_mid;
    registers['Pwm_Generator.cmp_1h_a'] = ls_on_full;
    registers['Pwm_Generator.cmp_3h_a'] = 0xffff;

    registers['Pwm_Generator.cmp_1l_b'] = hs_on_mid;
    registers['Pwm_Generator.cmp_2l_b'] = hs_on_full;
    registers['Pwm_Generator.cmp_2h_b'] = hs_off_mid;
    registers['Pwm_Generator.cmp_1h_b'] = hs_off_neg;
    registers['Pwm_Generator.cmp_3h_b'] = 0xffff;

    registers['Pwm_Generator.cnt_low_a'] = counter_start;
    registers['Pwm_Generator.cnt_high_a'] = counter_stop;

    registers['Pwm_Generator.cnt_low_b'] = counter_start;
    registers['Pwm_Generator.cnt_high_b'] = counter_stop;


    registers['Pwm_Generator.out_en_a'] = 0x3F;
    registers['Pwm_Generator.out_en_b'] = 0x3F;

    registers['Pwm_Generator.ch_ctrl_a'] = 1;
    registers['Pwm_Generator.ch_ctrl_b'] = 1;

    registers['Pwm_Generator.pwm_ctrl'] = 0x2428;

    return {workspace:ws, registers:registers};
}