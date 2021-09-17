// Copyright 2021 University of Nottingham Ningbo China
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

import {createTheme} from "react-data-table-component";
import {ColorTheme} from "../UI_elements";

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

