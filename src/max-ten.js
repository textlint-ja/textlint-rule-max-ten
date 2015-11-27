// LICENSE : MIT
"use strict";
import {RuleHelper} from "textlint-rule-helper"
import ObjectAssign from "object-assign"
import {getTokenizer} from "kuromojin";
import splitSentences from "sentence-splitter";
import Source from "structured-source";
const defaultOptions = {max: 3};
/**
 * @param {RuleContext} context
 * @param {object} options
 */
export default function (context, options = {}) {
    options = ObjectAssign({}, defaultOptions, options);
    const maxLen = options.max;
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
                    tokens.forEach(token => {
                        let surface = token.surface_form;
                        if (surface === "、") {
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
                                line: position.line-1,
                                column:position.column
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