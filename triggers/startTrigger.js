function start_trigger(parameters, context) {


    console.log(context);
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
    let counter_stop = Math.round(period*counter_frequency);


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
    ws['ls_off_mid'] = ls_off_mid;
    ws['ls_off_neg'] = ls_off_neg;
    ws['ls_on_mid'] = ls_on_mid;
    ws['ls_on_full'] = ls_on_full;

    ws['hs_off_mid'] = hs_off_mid;
    ws['hs_off_neg'] = hs_off_neg;
    ws['hs_on_mid'] = hs_on_mid;
    ws['hs_on_full'] = hs_on_full;

    return {workspace:ws, registers:registers};
}