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
    const maxLen = options.max;
    const punctuation = /[。]/;
    let helper = new RuleHelper(context);
    let {Syntax, RuleError, report, getSource} = context;
    let currentParagraphTexts = [];
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
            let currentTenCount = 0;
            /*
            <p>
            <str><code><img><str>
            <str>
            </p>
             */
            currentParagraphTexts.forEach(strNode => {
                let paddingLine = 0;
                let paddingColumn = 0;
                let text = getSource(strNode);
                let characters = text.split("");
                characters.forEach(char => {
                    if (char === "、") {
                        currentTenCount++;
                    }
                    if (char === "。") {
                        // reset
                        currentTenCount = 0;
                    }
                    // report
                    if (currentTenCount >= maxLen) {
                        var ruleError = new context.RuleError(`一つの文で"、"を${maxLen}つ以上使用しています`, {
                            line: paddingLine,
                            column: paddingColumn
                        });
                        report(strNode, ruleError);
                        currentTenCount = 0;
                    }
                    // calc padding{line,column}
                    if (char === "\n") {
                        paddingLine++;
                        paddingColumn = 0;
                    } else {
                        paddingColumn++;
                    }
                });
            });
        }
    }
}