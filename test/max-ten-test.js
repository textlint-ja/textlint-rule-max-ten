import fs from "fs";
import path from "path";
import TextLintTester from "textlint-tester";
import rule from "../src/max-ten";

function textIncludeTen(count) {
    return new Array(count + 1).join("テスト文章において、") + "です";
}

const tester = new TextLintTester();
// ruleName, rule, expected[]
tester.run("max-ten", rule, {
    // default max:3
    valid: [
        "名詞、名詞、名詞、名詞、名詞の場合は例外",
        "ビスケットの主な材料は(1)小麦粉、(2)牛乳、(3)ショートニング、(4)バター、(5)砂糖である。",
        "これは、TaskA、TaskB、TaskC、TaskDが処理するものです。",
        // 括弧は無視されるため、名詞の連続として扱う
        "変数の名前は、半角のアルファベットである`A`から`Z`（大文字）と`a`から`z`（小文字）、`_`（アンダースコア）、`$`（ダラー）、数字の`0`から`9`を組み合わせた名前にします。",
        {
            text: textIncludeTen(3)
        },
        {
            text: textIncludeTen(5),
            options: {
                max: 5
            }
        },
        {
            text: "これは、テストです。"
        },
        {
            text: "これは、これは、これは、これは、オプションでカウントされないのでOK",
            options: {
                touten: "，",
                kuten: "．"
            }
        },
        {
            text: `これは，これは．これは，これは，これは．`,
            options: {
                touten: "，",
                kuten: "．"
            }
        },
        // https://github.com/textlint-ja/textlint-rule-max-ten/issues/17
        "紅ちゃんは、たたえなくなっていいって、思う？ もっと大事なものがあったら、スパイになれなくてもいいって、思う？",
        "「紅ちゃんは、たたえなくなっていいって、思う？ もっと大事なものがあったら、スパイになれなくてもいいって、思う？」"
    ],
    invalid: [
        {
            text: `これは、これは、これは、これは、これはだめ。`,
            errors: [
                {
                    message: `一つの文で"、"を4つ以上使用しています`,
                    index: 15
                }
            ]
        },
        {
            text: `これは，これは，これは，これは，これは。`,
            errors: [
                {
                    message: `一つの文で"，"を4つ以上使用しています`,
                    index: 15
                }
            ],
            options: {
                touten: "，",
                kuten: "．"
            }
        },
        {
            text: `これは，これは，これは。これは，これは，これは，どうですか?`,
            errors: [
                {
                    message: `一つの文で"，"を4つ以上使用しています`,
                    index: 19
                }
            ],
            options: {
                touten: "，",
                kuten: "．"
            }
        },
        {
            text: textIncludeTen(6),
            options: {
                max: 5
            },
            errors: [
                {
                    message: `一つの文で"、"を6つ以上使用しています`
                }
            ]
        },
        {
            text: `これは、長文の例ですが、columnがちゃんと計算、されてるはずです。`,
            options: {
                max: 2
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
            text: "間に、Str以外の`code`Nodeが、あっても、OKと、聞いています。",
            options: {
                max: 3
            },
            errors: [
                {
                    message: `一つの文で"、"を4つ以上使用しています`,
                    line: 1,
                    column: 30
                }
            ]
        },
        {
            text: `複数のセンテンスがある場合。これでも、columnが、ちゃんと計算、されているはず、そのためのテキストです。`,
            //                                                                        ^ 42
            options: {
                max: 3
            },
            errors: [
                {
                    message: `一つの文で"、"を4つ以上使用しています`,
                    line: 1,
                    column: 42
                }
            ]
        },
        {
            text: `複数のセンテンスがあって、改行されている場合でも\n大丈夫です。これでも、lineとcolumnが、ちゃんと計算、されているはず、そのためのテキストです。`,
            options: {
                max: 3
            },
            errors: [
                {
                    message: `一つの文で"、"を4つ以上使用しています`,
                    line: 2,
                    column: 39
                }
            ]
        },
        // multiple paragraph
        {
            // 3行目が、の問題
            text: `このパラグラフはOKです。
            
変数の名前は、名前のルールが決まっていて、そのルールは複雑で、たくさんのルールがあるので、箇条書きしましょう。

3つめのパラグラフはもOKです。

`,
            errors: [
                {
                    message: '一つの文で"、"を4つ以上使用しています',
                    line: 3,
                    column: 45
                }
            ]
        }
    ]
});
