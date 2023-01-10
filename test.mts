import test from "node:test";
import { strict as assert } from "node:assert";
import { lintOpenFormula } from "./index.mjs";

test("bad sample fails", () => {
  const actual = lintOpenFormula("of:=[.B2]*[.B1]");
  const expected = "fail";
  assert(actual == expected);
});

test("good sample works", () => {
  const actual = lintOpenFormula("of:=Value*Factor");
  const expected = "success";
  assert(actual == expected);
});
