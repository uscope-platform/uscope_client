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

import {activePalette, cssVar} from "./themes.js";

export const ColorTheme = {
    global: {
        colors: {
            icon: '#666666',
        }
    },
    icon: {
        size: {
            small: '12px',
            medium: '24px',
            large: '48px',
            xlarge: '96px',
        },
        extend: undefined,
    },
    background:{
        level_1: cssVar("level_1"),
        level_2: cssVar("level_2"),
        level_3: cssVar("level_3"),
        level_4: cssVar("level_4"),
        level_5: cssVar("level_5"),
        accents: cssVar("accents"),
        transparent_accents: cssVar("transparent_accents"),
        select_background:cssVar("select_background"),
        borders: cssVar("borders"),
        bordersLight: cssVar("bordersLight")
    },
    // the border of a field that has a pending, applied or failed edit
    field:{
        dirty: cssVar("accents"),
        applied: cssVar("field_applied"),
        error: cssVar("field_error")
    },
    text: cssVar("text"),
    icons_color: cssVar("icons_color"),
    disabled_icon_color: cssVar("disabled_icon_color"),
    inactive_icons_color: cssVar("inactive_icons_color"),
    icons_size: "2em",
    plot_palette: activePalette.plot_palette,
    scope_status:{
        "unknown":"rgb(255,0,0)",
        "run":"rgb(122, 255, 160)",
        "free run":"rgb(122, 255, 160)",
        "wait":"rgb(255, 234, 122)",
        "stop":"rgb(255, 130, 122)"
    },
    emulator:{
      selected_node_border:"rgb(90, 90,244)"
    }
}as const;