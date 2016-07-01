# textlint-rule-max-ten [![Build Status](https://travis-ci.org/textlint-ja/textlint-rule-max-ten.svg?branch=master)](https://travis-ci.org/textlint-ja/textlint-rule-max-ten) [![Gitter](https://badges.gitter.im/textlint-ja/textlint-ja.svg)](https://gitter.im/textlint-ja/textlint-ja)

[textlint](https://github.com/textlint/textlint "textlint") rule is that limit maximum ten(、) count of sentence.

一文に利用できる`、`の数を制限する[textlint](https://github.com/textlint/textlint "textlint")ルール

一文の読点の数が多いと冗長で読みにくい文章となるため、読点の数を一定数以下にするルールです。
読点の数を減らすためには、句点(。)で文を区切る必要があります。

## Installation

    npm install textlint-rule-max-ten

## Usage

    $ npm install textlint textlint-rule-max-ten
    $ textlint --rule max-ten README.md
    #    11:0  error  一つの文で"、"を3つ以上使用しています  max-ten

## Setting

- `max`: number
    - デフォルト: 3
    - 一文に許可される読点の数

```json
{
  "rules": {
    "max-ten": {
        "max" : 3
    }
  }
}
```

## 例外

`<名詞>`、`<名詞>` のように名詞に挟まれた読点はカウントしません。
箇条書きとしての区切り文字として使われているため無視します。

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