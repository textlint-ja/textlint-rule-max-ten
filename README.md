# textlint-rule-max-ten [![Build Status](https://travis-ci.org/azu/textlint-rule-max-ten.svg?branch=master)](https://travis-ci.org/azu/textlint-rule-max-ten)

[textlint](https://github.com/textlint/textlint "textlint") rule is that limit maximum ten(、) count of sentence.

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
        "max" : 3
    }
  }
}
```

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