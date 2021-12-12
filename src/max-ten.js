// LICENSE : MIT
"use strict";
import { RuleHelper } from "textlint-rule-helper";
import { tokenize } from "kuromojin";
import { splitAST, Syntax as SentenceSyntax } from "sentence-splitter";
import { StringSource } from "textlint-util-to-string";

const defaultOptions = {
    // 1文に利用できる最大の、の数
    max: 3,
    // 例外ルールを適応するかどうか,
    strict: false,
    // 読点として扱う文字
    // https://ja.wikipedia.org/wiki/%E8%AA%AD%E7%82%B9
    touten: "、",
    // 句点として扱う文字
    // https://ja.wikipedia.org/wiki/%E5%8F%A5%E7%82%B9
    kuten: "。"
};

function isSandwichedMeishi({ before, token, after }) {
    if (before === undefined || after === undefined || token === undefined) {
        return false;
    }
    return before.pos === "名詞" && after.pos === "名詞";
}

/**
 * 括弧のトークンかどうか
 * @param token
 * @returns {boolean}
 */
function is括弧(token) {
    if (token.pos === "記号" && /^括弧/.test(token.pos_detail_1)) {
        return true;
    }
    if (token.surface_form === "(" || token.surface_form === ")") {
        return true;
    }
    return false;
}
/**
 * 括弧などの記号的なTokenはスキップとして隣接するTokenを探す
 * @see https://github.com/textlint-ja/textlint-rule-max-ten/issues/12
 * @param {*[]} tokens
 * @param {number} currentIndex
 * @param {"prev"|"next"} direction
 * @returns {undefined | *}
 */
function findSiblingMeaningToken({ tokens, currentIndex, direction }) {
    const delta = direction === "prev" ? -1 : 1;
    const sibilingToken = tokens[currentIndex + delta];
    if (!sibilingToken) {
        return;
    }
    // 括弧はスキップして、隣接Nodeを探す
    if (is括弧(sibilingToken)) {
        return findSiblingMeaningToken({
            tokens,
            currentIndex: currentIndex + delta,
            direction
        });
    }
    return sibilingToken;
}

/**
 * @param {RuleContext} context
 * @param {typeof defaultOptions} [options]
 */
module.exports = function (context, options = {}) {
    const maxLen = options.max ?? defaultOptions.max;
    const isStrict = options.strict ?? defaultOptions.strict;
    const touten = options.touten ?? defaultOptions.touten;
    const kuten = options.kuten ?? defaultOptions.kuten;
    const helper = new RuleHelper(context);
    const { Syntax, RuleError, report, getSource } = context;
    return {
        [Syntax.Paragraph](node) {
            if (helper.isChildNode(node, [Syntax.BlockQuote])) {
                return;
            }
            const resultNode = splitAST(node, {
                SeparatorParser: {
                    separatorCharacters: [
                        "?", // question mark
                        "!", //  exclamation mark
                        "？", // (ja) zenkaku question mark
                        "！" // (ja) zenkaku exclamation mark
                    ].concat(kuten)
                }
            });
            const sentences = resultNode.children.filter((childNode) => childNode.type === SentenceSyntax.Sentence);
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
            const checkSentence = async (sentence) => {
                const source = new StringSource(sentence);
                const text = source.toString();
                const tokens = await tokenize(text);
                let currentTenCount = 0;
                let lastToken = null;
                tokens.forEach((token, index) => {
                    const surface = token.surface_form;
                    if (surface === touten) {
                        // 名詞に囲まわれている場合は例外とする
                        const isSandwiched = isSandwichedMeishi({
                            before: findSiblingMeaningToken({
                                tokens,
                                currentIndex: index,
                                direction: "prev"
                            }),
                            token: token,
                            after: findSiblingMeaningToken({
                                tokens,
                                currentIndex: index,
                                direction: "next"
                            })
                        });
                        // strictなら例外を例外としない
                        if (!isStrict && isSandwiched) {
                            return;
                        }
                        currentTenCount++;
                        lastToken = token;
                    }
                    if (surface === kuten) {
                        // reset
                        currentTenCount = 0;
                    }
                    // report
                    if (currentTenCount > maxLen) {
                        const positionInSentence = source.originalIndexFromIndex(lastToken.word_position - 1);
                        // relative index from Paragraph Node
                        // Sentence start(relative) + word position(relative)
                        const index = sentence.range[0] - node.range[0] + positionInSentence;
                        const ruleError = new context.RuleError(
                            `一つの文で"${touten}"を${maxLen + 1}つ以上使用しています`,
                            {
                                index
                            }
                        );
                        report(node, ruleError);
                        currentTenCount = 0;
                    }
                });
            };
            return Promise.all(sentences.map(checkSentence));
        }
    };
};
