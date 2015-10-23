import rule from "../src/max-ten"
function textIncludeTen(count) {
    return (new Array(count + 1)).join("テスト、") + "です";
}
var TextLintTester = require("textlint-tester");
var tester = new TextLintTester();
// ruleName, rule, expected[]
tester.run("max-ten", rule, {
    // default max:3
    valid: [
        {
            text: textIncludeTen(3 - 1)
        },
        {
            text: textIncludeTen(5 - 1),
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
            text: `a、b、       c
、d`
            ,
            errors: [
                {
                    message: `一つの文で"、"を3つ以上使用しています`,
                    line: 2,
                    column: 1
                }
            ]
        },
        {
            text: textIncludeTen(5),
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
            text: `これは、長文、columnがちゃんと計算、されてるはずです。`,
            options: {
                "max": 3
            },
            errors: [
                {
                    message: `一つの文で"、"を3つ以上使用しています`,
                    line: 1,
                    column: 21
                }
            ]
        }
    ]
});