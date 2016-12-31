// LICENSE : MIT
"use strict";
import {RuleHelper} from "textlint-rule-helper"
import {getTokenizer} from "kuromojin";
import {split as splitSentences} from "sentence-splitter";
import Source from "structured-source";
const defaultOptions = {
    max: 3, // 1文に利用できる最大の、の数
    strict: false // 例外ルールを適応するかどうか
};

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
 * add two positions.
 * note: line starts with 1, column starts with 0.
 * @param {Position} base
 * @param {Position} relative
 * @return {Position}
 */
function addPositions(base, relative) {
    return {
        line: base.line + relative.line - 1, // line 1 + line 1 should be line 1
        column: relative.line == 1 ? base.column + relative.column // when the same line
            : relative.column               // when another line
    };
}
/**
 * @param {RuleContext} context
 * @param {object} [options]
 */
module.exports = function(context, options = {}) {
    const maxLen = options.max || defaultOptions.max;
    const isStrict = options.strict || defaultOptions.strict;
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
            /*
             # workflow
             1. split text to sentences
             2. sentence to tokens
             3. check tokens
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
                            // strictなら例外を例外としない
                            if (!isStrict && isSandwiched) {
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
                            let positionInSentence = source.indexToPosition(lastToken.word_position - 1);
                            let positionInNode = addPositions(sentence.loc.start, positionInSentence);
                            let ruleError = new context.RuleError(`一つの文で"、"を${maxLen}つ以上使用しています`, {
                                line: positionInNode.line - 1,
                                column: positionInNode.column
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