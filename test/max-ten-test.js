import rule from "../src/max-ten"
function textIncludeTen(count) {
    return (new Array(count)).join("テスト、") + "です";
}
var TextLintTester = require("textlint-tester");
var tester = new TextLintTester();
// ruleName, rule, expected[]
tester.run("max-ten", rule, {
    // default max:3
    valid: [
        {
            text: "テキスト、テキスト、テキスト。\nテキスト、テキスト、テキスト。"
        },
        {
            text: "a、b、c、d、です。",
            options: {
                "max": 5
            }
        },
        {
            text: "これは、テストです。"
        }

    ],
    invalid: [
        {
            text: "a、b、c、d、e、fです。",
            options: {
                "max": 5
            },
            errors: [
                {
                    message: `一つの文で"、"を5つ以上使用しています`
                }
            ]
        },
        {
            text: `これは、長文で、
行を分けたときにも、カウントされてるかをテスト、しています。`,
            options: {
                "max": 3
            },
            errors: [
                {
                    message: `一つの文で"、"を3つ以上使用しています`
                }
            ]
        }
    ]
});