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
    it("should lint wrong tech words", function () {
        var filePath = path.join(__dirname, "/fixtures/README.md");
        var result = textlint.lintFile(filePath);
        assert(result.filePath === filePath);
        assert(result.messages.length > 0);
        assert.equal(result.messages[0].ruleId, "max-ten");
    });
});