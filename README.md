# textlint-rule-max-ten [![Actions Status: test](https://github.com/textlint-ja/textlint-rule-max-ten/workflows/test/badge.svg)](https://github.com/textlint-ja/textlint-rule-max-ten/actions?query=workflow%3A"test")

[textlint](https://github.com/textlint/textlint "textlint") rule is that limit maximum ten(、) count of sentence.

一文に利用できる`、`の数を制限する[textlint](https://github.com/textlint/textlint "textlint")ルール

一文の読点の数が多いと冗長で読みにくい文章となるため、読点の数を一定数以下にするルールです。 読点の数を減らすためには、句点(。)で文を区切る必要があります。

## Installation

    npm install textlint-rule-max-ten

## Usage

    $ npm install textlint textlint-rule-max-ten
    $ textlint --rule max-ten README.md
    #    11:0  error  一つの文で"、"を3つ以上使用しています  max-ten

## Options

- `max`: number
    - デフォルト: 3
    - 一文に許可される読点の数 + 1となった場合にエラーとします。デフォルトでは4つの"、"が一文にあるとエラーとなります。

```json5
{
  "rules": {
    "max-ten": {
      // 1文に利用できる最大の、の数
      // max: 3の場合は4つ以上の読点でエラーとなる
      "max": 3,
      // 例外ルールを適応するかどうか,
      "strict": false,
      // 読点として扱う文字
      // https://ja.wikipedia.org/wiki/%E8%AA%AD%E7%82%B9
      "touten": "、",
      // 句点として扱う文字
      // https://ja.wikipedia.org/wiki/%E5%8F%A5%E7%82%B9
      "kuten": "。"
    }
  }
}
```

読点に「，」句点に「．」を使う場合は、次のように設定します。

```json5
{
  "rules": {
    "max-ten": {
      // 読点として扱う文字
      "touten": "，",
      // 句点として扱う文字
      "kuten": "．"
    }
  }
}
```

## 例外

`<名詞>`、`<名詞>` のように名詞に挟まれた読点はカウントしません。 箇条書きとしての区切り文字として使われているため無視します。

`<名詞>(A)、<名詞>(B)、<名詞>(C)` のように名詞を説明する括弧が`、`に隣接するケースも、名詞に挟まれた読点としてカウントしません。

- [X(A)、Y(B)、Z(C) のパターン · Issue #12 · textlint-ja/textlint-rule-max-ten](https://github.com/textlint-ja/textlint-rule-max-ten/issues/12)

## Tests

    npm test

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## License

MIT
