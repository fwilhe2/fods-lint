import { XMLParser } from "fast-xml-parser";
import { readFile } from "fs/promises";

export function ensureIsArray(object: any) {
  if (object === undefined) {
    return [];
  }
  if (!Array.isArray(object)) {
    return [object];
  }
  return object;
}

const options = {
  ignoreAttributes: false,
};

const fileContent = await readFile("./test.fods");

const parser = new XMLParser(options);
const parsedFods = parser.parse(fileContent);

const formulaBadSample = ensureIsArray(
  ensureIsArray(
    ensureIsArray(
      parsedFods["office:document"]["office:body"]["office:spreadsheet"][
        "table:table"
      ]
    )[0]["table:table-row"]
  )[2]["table:table-cell"]
)[1]["@_table:formula"];
const formulaGoodSample = ensureIsArray(
  ensureIsArray(
    ensureIsArray(
      parsedFods["office:document"]["office:body"]["office:spreadsheet"][
        "table:table"
      ]
    )[0]["table:table-row"]
  )[3]["table:table-cell"]
)[1]["@_table:formula"];

export const LintResult = {
  success: "success",
  fail: "fail",
} as const;

export type LintResult = (typeof LintResult)[keyof typeof LintResult];

export function lintOpenFormula(f: string): LintResult {
  const ofPrefix = "of:=";
  const formulaComponents = f.substring(ofPrefix.length).split(/[+\-*/]/);
  const badComponents = formulaComponents.filter((x) => x.startsWith("["));
  if (badComponents.length > 0) {
    return "fail";
  }

  return "success";
}

console.log(lintOpenFormula(formulaBadSample));
console.log(lintOpenFormula(formulaGoodSample));
