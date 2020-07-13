import {createTheme} from "react-data-table-component";
import ColorTheme from "../UI_elements/ColorTheme";

createTheme('uScopeTableTheme', {
    text: {
        primary: '#ffffff',
        secondary: '#aaaaaa',
    },
    background: {
        default: '#00000000',
    },
    context: {
        background: '#cb4b16',
        text: '#FFFFFF',
    },
    divider: {
        default: '#073642',
    },
    action: {
        button: 'rgba(0,0,0,.54)',
        hover: 'rgba(0,0,0,.08)',
        disabled: 'rgba(0,0,0,.12)',
    },
});

export const TableStyle = {
    header: {
        style: {
            minHeight: '0',
            maxHeight: '2.2rem',
            marginBottom:'0.4rem'
        },
    },
    headRow: {
        style: {
            borderTopStyle: 'solid',
            borderTopWidth: '3px',
            borderTopColor: ColorTheme.dark_theme.level_3,
            borderBottomStyle: 'solid',
            borderBottomWidth: '1px',
            borderBottomColor: ColorTheme.dark_theme.level_3,
        },
    },
    rows: {
        style: {
            '&:not(:last-of-type)': {
                borderBottomStyle: 'solid',
                borderBottomWidth: '1px',
                borderBottomColor: ColorTheme.dark_theme.level_3,
            },
        },
    },
};

