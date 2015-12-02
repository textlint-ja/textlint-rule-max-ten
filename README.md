# textlint-rule-max-ten [![Build Status](https://travis-ci.org/azu/textlint-rule-max-ten.svg?branch=master)](https://travis-ci.org/azu/textlint-rule-max-ten)

[textlint](https://github.com/azu/textlint "textlint") rule is that limit maximum ten(、) count of sentence.

## Installation

    npm install textlint-rule-max-ten

## Usage

    $ npm install textlint textlint-rule-max-ten
    $ textlint --rule max-ten README.md
    #    11:0  error  一つの文で"、"を3つ以上使用しています  max-ten

## Configure

Configure the maximum number of "、" allowed in a sentence. The default is `3`

Configure `"max"` value of the `.textlintrc` file.

```json
{
  "rules": {
    "max-ten": {
        // 1文で利用できる"、"の最大数
        "max" : 3
    }
  }
}
```

## Example

> これは、長文の例ですが、読点の数が3つ以上あるので、エラーが報告されます。

=> error  一つの文で"、"を3つ以上使用しています

> ビスケットの主な材料は(1)小麦粉、(2)牛乳、(3)ショートニング、(4)バター、(5)砂糖である。

-  No error: 名詞同士で囲まれている `、` はカウントされない
- 設定で `{ strict: true }` とした場合はこの例外は適応されずエラーとします


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