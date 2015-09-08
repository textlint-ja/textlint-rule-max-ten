// LICENSE : MIT
"use strict";
import {RuleHelper} from "textlint-rule-helper"

const defaultOptions = {max: 3};
function countTen(text) {
    return text.split("、").length - 1;
}
/**
 * @param {RuleContext} context
 * @param {object} options
 */
export default function (context, options = defaultOptions) {
    var maxLen = options.max;
    const punctuation = /[。.]/;
    let helper = new RuleHelper(context);
    let {Syntax, RuleError, report, getSource} = context;
    var currentParagraphText = "";
    return {
        [Syntax.Paragraph](){
            currentParagraphText = ""
        },
        [Syntax.Str](node){
            // ignore text from external factor
            if (helper.isChildNode(node, [Syntax.Link, Syntax.Image, Syntax.BlockQuote])) {
                return;
            }
            currentParagraphText += getSource(node);
        },
        [Syntax.Paragraph + ":exit"](node){
            var sentences = currentParagraphText.split(punctuation);
            sentences.forEach(sentence => {
                if (countTen(sentence) >= maxLen) {
                    var ruleError = new context.RuleError(`一つの文で"、"を${maxLen}つ以上使用しています`);
                    report(node, ruleError);
                }
            });
        }
    }
}