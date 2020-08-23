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
                    regex : "^ldr|^nop|^add(i)?|^sub(i)?|^mul(i)?|^ldc|^stop|^itf|^fti|^ble|^bgt|^bne|^beq|^mov"
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







