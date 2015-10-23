// LICENSE : MIT
"use strict";
import {RuleHelper} from "textlint-rule-helper"
import ObjectAssign from "object-assign"
const defaultOptions = {max: 3};
function countTen(text) {
    return text.split("、").length - 1;
}
/**
 * @param {RuleContext} context
 * @param {object} options
 */
export default function (context, options = {}) {
    options = ObjectAssign({}, defaultOptions, options);
    var maxLen = options.max;
    const punctuation = /[。]/;
    let helper = new RuleHelper(context);
    let {Syntax, RuleError, report, getSource} = context;
    var currentParagraphTexts = [];
    return {
        [Syntax.Paragraph](){
            currentParagraphTexts = []
        },
        [Syntax.Str](node){
            // ignore text from external factor
            if (helper.isChildNode(node, [Syntax.Link, Syntax.Image, Syntax.BlockQuote])) {
                return;
            }
            currentParagraphTexts.push(node);
        },
        [Syntax.Paragraph + ":exit"](){
            currentParagraphTexts.forEach(node => {
                var currentParagraphText = getSource(node);
                var sentences = currentParagraphText.split(punctuation);
                sentences.forEach(sentence => {
                    if (countTen(sentence) >= maxLen) {
                        var ruleError = new context.RuleError(`一つの文で"、"を${maxLen}つ以上使用しています`);
                        report(node, ruleError);
                    }
                });
            });
        }
    }
}