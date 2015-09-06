import {textlint} from "textlint"
import rule from "../src/max-ten"
import path from "path"
import assert from "power-assert"
describe("max-ten", function () {
    beforeEach(function () {
        textlint.setupRules({
            "max-ten": rule
        });
    });
    afterEach(function () {
        textlint.resetRules();
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