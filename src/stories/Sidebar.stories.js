import React from 'react';
import RegisterProperties from "../components/UI_elements/SidebarComponents/RegisterProperties";
import PlotChannelProperties from "../components/UI_elements/SidebarComponents/PlotChannelProperties";
import {ThemeProvider} from "styled-components";
import ColorTheme from "../components/UI_elements/ColorTheme";

export default {
    title: 'Sidebar',
};

const reg_example = {
    "ID": "cmp_thr_1",
    "description": "This register controls the thresholds for the low (latching mode) and low-falling (normal mode) thresholds, for the filtered (lower word) and fast acting (higher word) comparators",
    "direction": "R/W",
    "field_descriptions": [
        "Threshold for the filtered comparator",
        "Threshold for the fast acting comparator"
    ],
    "field_names": [
        "Filtered threshold",
        "Fast threshold"
    ],
    "offset": "0x0",
    "register_format": "words",
    "register_name": "Comparators threshold 1",
    "value": 0
}
export const RegisterPropertiesExample = () => <RegisterProperties register={reg_example}/>

const channel_example = {
        enabled: false,
        id: 1,
        max_value: 180,
        min_value: 0,
        name: 'Current A'
    }

export const PlotChannel = () => {
    return(
        <ThemeProvider theme={ColorTheme}>
            <PlotChannelProperties channel={channel_example}/>
        </ThemeProvider>
        )

}


const app_example = {
    application_name: 'AdcTest',
        bitstream: 'AdcTest.bin',
        n_enables: 1,
        clock_frequency: 100000000,
        timebase_address: '0x43c00400',
        channels: [
        {
            enabled: false,
            id: 1,
            max_value: 180,
            min_value: 0,
            name: 'Current A'
        },
        {
            enabled: false,
            id: 2,
            max_value: 180,
            min_value: 0,
            name: 'Current B'
        },
        {
            enabled: false,
            id: 3,
            max_value: 180,
            min_value: 0,
            name: 'Current C'
        },
        {
            enabled: false,
            id: 4,
            max_value: 600,
            min_value: 0,
            name: 'Voltage A'
        },
        {
            enabled: false,
            id: 5,
            max_value: 600,
            min_value: 0,
            name: 'Voltage B'
        },
        {
            enabled: false,
            id: 6,
            max_value: 600,
            min_value: 0,
            name: 'Voltage C'
        }
    ],
        initial_registers_values: [
        {
            address: '0x43c00004',
            value: '0x1B'
        },
        {
            address: '0x43c00000',
            value: '0x1DC2'
        },
        {
            address: '0x43c00110',
            value: '0x0B04051B'
        },
        {
            address: '0x43c00114',
            value: '0x146D1086'
        },
        {
            address: '0x43c00118',
            value: '0x146D15D6'
        },
        {
            address: '0x43c0011C',
            value: '0x0B041086'
        },
        {
            address: '0x43c00120',
            value: '0x051B'
        },
        {
            address: '0x43c00124',
            value: '0x0'
        },
        {
            address: '0x43c00128',
            value: '0x1'
        },
        {
            address: '0x43c00400',
            value: '0x1200'
        },
        {
            address: '0x43c00300',
            value: '0x3'
        }
    ],
        macro: [
        {
            name: 'start',
            trigger: 'start_trigger'
        },
        {
            name: 'stop',
            trigger: 'stop_trigger'
        },
        {
            name: 'macro 3',
            trigger: 'trigger_3'
        },
        {
            name: 'macro 4',
            trigger: 'trigger_4'
        },
        {
            name: 'macro 5',
            trigger: 'trigger_5'
        },
        {
            name: 'macro 6',
            trigger: 'trigger_6'
        }
    ],
        parameters: [
            {
                'default-unit': '',
                parameter_id: 'sw_freq',
                parameter_name: 'Switching Frequency',
                trigger: 'switching_frequency_trigger',
                value: 1000,
                visible: true
            },
            {
                'default-unit': '',
                parameter_id: 'duty',
                parameter_name: 'Duty Cycle',
                trigger: 'duty_trigger',
                value: 0.5,
                visible: true
            },
            {
                'default-unit': '',
                parameter_id: 'mid_lvl_duration',
                parameter_name: 'Mid level duration',
                trigger: 'mid_level_trigger',
                value: 2e-8,
                visible: true
            },
            {
                parameter_id: 'clk_freq',
                parameter_name: 'clock_frequency',
                value: 40000000,
                visible: false
            },
            {
                parameter_id: 'deadtime',
                parameter_name: 'Deadtime',
                value: 0.000001,
                visible: false
            }
        ],
        tabs: [
        {
            name: 'ADC processing',
            tab_id: 'ADC_processing',
            base_address: '0x43c00100',
            image_src: 'static/Images/ADC_processing.png',
            type: 'Registers',
            proxied: false,
            user_accessible: true
        },
        {
            base_address: '0x43c00000',
            image_src: 'static/Images/SPI.png',
            name: 'SPI',
            proxied: false,
            tab_id: 'SPI',
            type: 'Registers',
            user_accessible: true
        },
        {
            base_address: '0x43c00300',
            name: 'GPIO',
            proxied: false,
            tab_id: 'GPIO',
            type: 'Registers',
            user_accessible: false
        },
        {
            base_address: '0x43c00400',
            name: 'enable generator',
            proxied: false,
            tab_id: 'enable_generator',
            type: 'Registers',
            user_accessible: false
        }
    ],

}