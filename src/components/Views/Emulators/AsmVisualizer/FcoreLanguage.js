import {parser} from "./parser"
import {
    LRLanguage,
    LanguageSupport,
    indentNodeProp,
    foldNodeProp,
    delimitedIndent,
    foldInside
} from "@codemirror/language"
import {styleTags, tags as t} from "@lezer/highlight"

export const FcoreAsm = LRLanguage.define({
    parser: parser.configure({
        props: [
            indentNodeProp.add({
                Application: delimitedIndent({closing: ")", align: false})
            }),
            foldNodeProp.add({
                Application: foldInside
            }),
            styleTags({
                Register: t.keyword,
                LineComment: t.comment,
                BlockComment: t.comment,
                Opcode: t.string,
                Number: t.number
            })
        ]
    }),
    languageData: {
        commentTokens: {line: ";"}
    }
})

export let FcoreHighlighting = styleTags({
    Register: t.keyword,
    LineComment: t.comment,
    BlockComment: t.comment,
    Opcode: t.string,
    Number: t.number

});

export function Fcore() {
    return new LanguageSupport(FcoreAsm)
}