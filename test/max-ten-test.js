import rule from "../src/max-ten"
function textIncludeTen(count) {
    return (new Array(count + 1)).join("テスト文章において、") + "です";
}
var TextLintTester = require("textlint-tester");
var tester = new TextLintTester();
// ruleName, rule, expected[]
tester.run("max-ten", rule, {
    // default max:3
    valid: [
        "名詞、名詞、名詞、名詞の場合は例外",
        "ビスケットの主な材料は(1)小麦粉、(2)牛乳、(3)ショートニング、(4)バター、(5)砂糖である。",
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
            text: `これは、これは、これは
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
            text: `これは、長文の例ですが、columnがちゃんと計算、されてるはずです。`,
            options: {
                "max": 3
            },
            errors: [
                {
                    message: `一つの文で"、"を3つ以上使用しています`,
                    line: 1,
                    column: 26
                }
            ]
        },
        {
            text: "間に、Str以外の`code`Nodeが、あっても、OK",
            options: {
                "max": 3
            },
            errors: [
                {
                    message: `一つの文で"、"を3つ以上使用しています`,
                    line: 1,
                    column: 26
                }
            ]
        }
    ]
});