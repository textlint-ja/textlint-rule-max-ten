// LICENSE : MIT
"use strict";
import {RuleHelper} from "textlint-rule-helper"
import {getTokenizer} from "kuromojin";
import splitSentences from "sentence-splitter";
import Source from "structured-source";
const defaultOptions = {max: 3};

function isSandwichedMeishi({
    before,
    token,
    after
    }) {
    if (before === undefined || after === undefined || token === undefined) {
        return false;
    }
    return before.pos === "名詞" && after.pos === "名詞";
}
/**
 * @param {RuleContext} context
 * @param {object} options
 */
export default function (context, options = {}) {
    const maxLen = options.max || defaultOptions.max;
    let helper = new RuleHelper(context);
    let {Syntax, RuleError, report, getSource} = context;
    return {
        [Syntax.Paragraph](node){
            if (helper.isChildNode(node, [Syntax.BlockQuote])) {
                return;
            }
            let sentences = splitSentences(getSource(node), {
                charRegExp: /[。\?\!？！]/,
                newLineCharacters: "\n\n"
            });
            /*
            <p>
            <str><code><img><str>
            <str>
            </p>
             */
            return getTokenizer().then(tokenizer => {
                sentences.forEach(sentence => {
                    let text = sentence.value;
                    let source = new Source(text);
                    let currentTenCount = 0;
                    let tokens = tokenizer.tokenizeForSentence(text);
                    let lastToken = null;
                    tokens.forEach((token, index) => {
                        let surface = token.surface_form;
                        if (surface === "、") {
                            // 名詞に過去まわれている場合は例外とする
                            let isSandwiched = isSandwichedMeishi({
                                before: tokens[index - 1],
                                token: token,
                                after: tokens[index + 1]
                            });
                            if (isSandwiched) {
                                return;
                            }
                            currentTenCount++;
                            lastToken = token;
                        }
                        if (surface === "。") {
                            // reset
                            currentTenCount = 0;
                        }
                        // report
                        if (currentTenCount >= maxLen) {
                            let position = source.indexToPosition(lastToken.word_position - 1);
                            let ruleError = new context.RuleError(`一つの文で"、"を${maxLen}つ以上使用しています`, {
                                line: position.line - 1,
                                column: position.column
                            });
                            report(node, ruleError);
                            currentTenCount = 0;
                        }
                    });
                });
            });
        }
    }
}