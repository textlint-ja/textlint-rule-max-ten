// LICENSE : MIT
"use strict";
import { RuleHelper } from "textlint-rule-helper"
import { getTokenizer } from "kuromojin";
import { splitAST, Syntax as SentenceSyntax } from "sentence-splitter";
import { StringSource } from "textlint-util-to-string";

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
 * @param {RuleContext} context
 * @param {object} [options]
 */
module.exports = function (context, options = {}) {
    const maxLen = options.max || defaultOptions.max;
    const isStrict = options.strict || defaultOptions.strict;
    const helper = new RuleHelper(context);
    const { Syntax, RuleError, report, getSource } = context;
    return {
        [Syntax.Paragraph](node) {
            if (helper.isChildNode(node, [Syntax.BlockQuote])) {
                return;
            }
            const resultNode = splitAST(node);
            const sentences = resultNode.children.filter(childNode => childNode.type === SentenceSyntax.Sentence);
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
                    const source = new StringSource(sentence);
                    const text = source.toString();
                    const tokens = tokenizer.tokenizeForSentence(text);
                    let currentTenCount = 0;
                    let lastToken = null;
                    tokens.forEach((token, index) => {
                        let surface = token.surface_form;
                        if (surface === "、") {
                            // 名詞に囲まわれている場合は例外とする
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
                            const positionInSentence = source.originalIndexFromIndex(lastToken.word_position - 1);
                            const index = sentence.range[0] + positionInSentence;
                            const ruleError = new context.RuleError(`一つの文で"、"を${maxLen}つ以上使用しています`, {
                                index
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
