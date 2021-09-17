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

import "ace-builds/src-noconflict/mode-java";

export class fCoreRules extends window.ace.acequire(
    "ace/mode/text_highlight_rules"
).TextHighlightRules {
    constructor() {
        super();
        this.$rules = {
            "start" : [
                {
                    token : "variable",
                    regex : "(^let|^const|^input|^output|^for)"
                },
                {
                    token : "string",
                    regex : "^ldr|^nop|^add|^sub|^mul|^ldc|^stop|^itf|^fti|^ble|^bgt|^bne|^beq|^mov|^satn|^satp|^and|^or|^not"
                },
                {
                    token : "comment",
                    regex : "\\/\\*",
                    next : "multiline_close"
                },
                {
                    token : "comment",
                    regex : "(#.*)"
                },
                {
                    token : "comment",
                    regex : "(//.*)"
                },
                {
                    defaultToken : "text",
                }
            ],
            multiline_close : [
                {
                    token : "comment", // closing comment
                    regex : "\\*\\/",
                    next : "start"
                }, {
                    defaultToken : "comment"
                }
            ]
        };
    }
}

export default class fCoreMode extends window.ace.acequire("ace/mode/java")
    .Mode {
    constructor() {
        super();
        this.HighlightRules = fCoreRules;
    }
}







