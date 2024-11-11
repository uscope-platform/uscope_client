import {parser} from "./parser"
import {LRLanguage, LanguageSupport} from "@codemirror/language"
import {styleTags, tags as t} from "@lezer/highlight"

export const FcoreAsm = LRLanguage.define({
    parser: parser.configure({
        props: [
            styleTags({
                Register: t.keyword,
                LineComment: t.comment,
                BlockComment: t.comment,
                Opcode: t.string,
                Number: t.number
            })
        ]
    })
})

export function Fcore() {
    return new LanguageSupport(FcoreAsm)
}