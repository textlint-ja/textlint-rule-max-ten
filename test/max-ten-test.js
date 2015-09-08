import {textlint} from "textlint"
import rule from "../src/max-ten"
import path from "path"
import assert from "power-assert"
function textIncludeTen(count) {
    return (new Array(count)).join("テスト、") + "です";
}
describe("max-ten", function () {
    afterEach(function () {
        textlint.resetRules();
    });
    context("when use default option", function () {
        beforeEach(function () {
            textlint.setupRules({
                "max-ten": rule
            });
        });
        it("should report error", function () {
            var filePath = path.join(__dirname, "/fixtures/error.md");
            var result = textlint.lintFile(filePath);
            assert(result.filePath === filePath);
            assert(result.messages.length > 0);
            assert.equal(result.messages[0].ruleId, "max-ten");
        });
        it("should not report error", function () {
            var filePath = path.join(__dirname, "/fixtures/pass.md");
            var result = textlint.lintFile(filePath);
            assert(result.filePath === filePath);
            assert(result.messages.length === 0);
        });
    });
    context("Change options#maxLen", function () {
        context("when maxLen is 5, count of `、` < 5", function () {
            it("should not report error", ()=> {
                textlint.setupRules({
                    "max-ten": rule
                }, {
                    "max-ten": {
                        "max": 5
                    }
                });
                var result = textlint.lintMarkdown("a、b、c、d、です。");
                console.log(result.messages);
                assert(result.messages.length === 0);
            });
        });
        context("when maxLen is 5, count of `、` >= 5", function () {
            it("should report error", ()=> {
                textlint.setupRules({
                    "max-ten": rule
                }, {
                    "max-ten": {
                        "max": 5
                    }
                });
                var result = textlint.lintMarkdown("a、b、c、d、e、です。");
                assert(result.messages.length > 0);
            });
        });
    });
});