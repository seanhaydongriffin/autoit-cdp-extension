import {
  Hover,
  MarkdownString,
  ParameterInformation,
  SignatureHelp,
  SignatureInformation,
  languages,
} from 'vscode';
import {
  AUTOIT_MODE,
  buildFunctionSignature,
  findFilepath,
  functionDefinitionRegex,
  getIncludeData,
  includePattern,
  libraryIncludePattern,
} from './util';
import defaultSigs from './signatures';
import { DEFAULT_UDFS } from './constants';

let currentIncludeFiles = [];
let includes = {};
const FUNCTION_NAME_PART_INDEX_FROM_END = 2;

/**
 * Reduces a partial line of code to the current Function for parsing
 * @param {string} code The line of code
 */
function getParsableCode(code) {
  const reducedCode = code
    .replace(/\w+\([^()]*\)/g, '')
    .replace(/"[^"]*"/g, '')
    .replace(/'[^']*'/g, '') // Remove double/single quote sets
    .replace(/"[^"]*(?=$)/g, '') // Remove double quote and text at end of line
    .replace(/'[^']*(?=$)/g, '') // Remove single quote and text at end of line
    .replace(/\([^()]*\)/g, '') // Remove paren sets
    .replace(/\({2,}/g, '('); // Reduce multiple open parens

  return reducedCode;
}

/**
 * Parses the current function calling for SignatureHelp from a string of AutoIt code.
 * Gets the second-to-last part (right before the last open parenthesis)
 * and extracts the function name
 *
 * @param {string} code - The AutoIt code to parse.
 * @returns {?string} - The name of the current function, or null if it couldn't be parsed.
 */
function getCurrentFunction(code) {
  const functionCallParts = code.split('(');
  if (functionCallParts.length <= 1) {
    return null;
  }

  const currentFunctionPartIndex = functionCallParts.length - FUNCTION_NAME_PART_INDEX_FROM_END;
  const functionCallPart = functionCallParts[currentFunctionPartIndex].match(/(.*)\b(\w+)/);
  if (functionCallPart) {
    return functionCallPart[2];
  }

  return null;
}

function countCommas(code) {
  // Find the position of the closest/last open paren
  const openParen = code.lastIndexOf('(');
  // Count non-string commas in text following open paren
  let commas = code.slice(openParen).match(/(?!\B["'][^"']*),(?![^"']*['"]\B)/g);
  if (commas === null) {
    commas = 0;
  } else {
    commas = commas.length;
  }

  return commas;
}

function getCallInfo(doc, pos) {
  // Acquire the text up the point where the current cursor/paren/comma is at
  const codeAtPosition = doc.lineAt(pos.line).text.substring(0, pos.character);
  const cleanCode = getParsableCode(codeAtPosition);

  return {
    func: getCurrentFunction(cleanCode),
    commas: countCommas(cleanCode),
  };
}

function arraysMatch(arr1, arr2) {
  if (arr1.length === arr2.length && arr1.some(v => arr2.indexOf(v) <= 0)) {
    return true;
  }
  return false;
}

/**
 * Retrieves the includes from the given text.
 *
 * @param {string} text - The text to search for includes.
 * @returns {string[]} An array of includes found in the text.
 */
function getIncludesFromText(text) {
  const includesCheck = [];
  let pattern = includePattern.exec(text);
  while (pattern) {
    includesCheck.push(pattern[1]);
    pattern = includePattern.exec(text);
  }
  return includesCheck;
}

/**
 * Retrieves the library includes from the given text.
 *
 * @param {string} text - The text to search for library includes.
 * @returns {RegExpMatchArray[]} An array of library includes found in the text.
 */
function getLibraryIncludesFromText(text) {
  const libraryIncludes = [];
  let pattern = libraryIncludePattern.exec(text);
  while (pattern) {
    libraryIncludes.push(pattern);
    pattern = libraryIncludePattern.exec(text);
  }
  return libraryIncludes;
}

/**
 * Retrieves the includes and library includes from the given document.
 * Determines whether includes should be re-parsed or not.
 *
 * @param {Object} doc - The document to search for includes.
 * @returns {Object} An object containing the includes found in the document.
 */
function getIncludedFunctionSignatures(doc) {
  const text = doc.getText();
  const includesCheck = getIncludesFromText(text);
  const libraryIncludes = getLibraryIncludesFromText(text);

  if (!arraysMatch(includesCheck, currentIncludeFiles)) {
    includes = {};
    includesCheck.forEach(script => {
      const newIncludes = getIncludeData(script, doc);
      Object.assign(includes, newIncludes);
    });
    currentIncludeFiles = includesCheck;
  }

  libraryIncludes.forEach(pattern => {
    const filename = pattern[1].replace('.au3', '');
    if (DEFAULT_UDFS.indexOf(filename) === -1) {
      const fullPath = findFilepath(pattern[1]);
      if (fullPath) {
        const newData = getIncludeData(fullPath, doc);
        Object.assign(includes, newData);
      }
    }
  });

  return includes;
}

/**
 * Returns an object of AutoIt functions found within the current AutoIt script
 * @param {import("vscode").TextDocument} doc The TextDocument object representing the AutoIt script
 * @returns {Object} Object containing SignatureInformation objects
 */
function getLocalFunctionSignatures(doc) {
  const text = doc.getText();
  const functions = {};

  let functionMatch = functionDefinitionRegex.exec(text);
  while (functionMatch) {
    const functionData = buildFunctionSignature(functionMatch, text, doc.fileName);
    functions[functionData.functionName] = functionData.functionObject;
    functionMatch = functionDefinitionRegex.exec(text);
  }

  return functions;
}

/**
 * Creates a SignatureInformation object from a given signature.
 * @param {Object} foundSig - The signature to create the SignatureInformation object from.
 * @returns {SignatureInformation} The created SignatureInformation object.
 */
function createSignatureInfo(foundSig) {
  const signatureInfo = new SignatureInformation(
    foundSig.label,
    new MarkdownString(`##### ${foundSig.documentation}`),
  );
  signatureInfo.parameters = Object.keys(foundSig.params).map(
    key =>
      new ParameterInformation(
        foundSig.params[key].label,
        new MarkdownString(foundSig.params[key].documentation),
      ),
  );
  return signatureInfo;
}

/**
 * Creates a Hover object for the user created functions.
 *
 * @param {import("vscode").TextDocument} document - The TextDocument object representing the AutoIt script
 * @param {import("vscode").Position} position - The position of the cursor when the function was called * @returns {Hover | null} - A Hover object containing the hover info, or null if no info found.
 */
export const signatureHoverProvider = languages.registerHoverProvider(AUTOIT_MODE, {
  provideHover(document, position) {
    const hoveredPosition = document.getWordRangeAtPosition(position);
    if (!hoveredPosition) return null;
    const hoveredWord = document.getText(hoveredPosition);

    const allSignatures = {
      ...getIncludedFunctionSignatures(document),
      ...getLocalFunctionSignatures(document),
    };

    const matchedSignature = allSignatures[hoveredWord];

    if (!matchedSignature || !matchedSignature.label) return null;

    const documentationLines = matchedSignature.documentation.split('\r');
    documentationLines[1] = `##### ${documentationLines[1]}`;
    const hoverText = [...documentationLines, `\`\`\`\r${matchedSignature.label}\r\`\`\``];

    return new Hover(hoverText);
  },
});

export default languages.registerSignatureHelpProvider(
  AUTOIT_MODE,
  {
    /**
     * Provides signature help for a given document and position.
     * @param {import("vscode").TextDocument} document - The document to provide signature help for.
     * @param {import("vscode").Position} position - The position in the document to provide signature help for.
     */
    provideSignatureHelp(document, position) {
      const caller = getCallInfo(document, position);
      if (!caller.func) return null;

      const allSignatures = {
        ...getIncludedFunctionSignatures(document),
        ...defaultSigs,
        ...getLocalFunctionSignatures(document),
      };

      // CDP method → UDF mapping
      const cdpMethodMap = {
        // Browser
        launch: '_CDP_Browser_Launch',
        exists: '_CDP_Browser_Exists',
        isRunning: '_CDP_Browser_IsRunning',
        forceClose: '_CDP_Browser_ForceClose',
        newPage: '_CDP_Browser_NewPage',
        getNewPage: '_CDP_Browser_GetNewPage',
        close: '_CDP_Browser_Close',

         // Page
        goto: '_CDP_Page_Goto',
        locator: '_CDP_Page_Locator',

        // Locator
        click: '_CDP_Locator_Click',
        hover: '_CDP_Locator_Hover',
        fill: '_CDP_Locator_Fill',
        scrollIntoView: '_CDP_Locator_ScrollIntoView',

        textContent: '_CDP_Locator_TextContent',
        innerText: '_CDP_Locator_InnerText',
        innerTextCRStripped: '_CDP_Locator_InnerTextCRStripped',
        innerTextLFStripped: '_CDP_Locator_InnerTextLFStripped',
        innerTextReplace: '_CDP_Locator_InnerTextReplace',
        innerHTML: '_CDP_Locator_InnerHTML',
        inputValue: '_CDP_Locator_InputValue',
        getAttribute: '_CDP_Locator_GetAttribute',
        isVisible: '_CDP_Locator_IsVisible',
        isHidden: '_CDP_Locator_IsHidden',
        isEnabled: '_CDP_Locator_IsEnabled',
        isDisabled: '_CDP_Locator_IsDisabled',
        isEditable: '_CDP_Locator_IsEditable',
        isChecked: '_CDP_Locator_IsChecked',

        // Expect root
        expect: '_CDP_Test_Step_Expect',

        // Expect methods
        toBeVisible: '_CDP_Expect_Locator_ToBeVisible',
        toBeHidden: '_CDP_Expect_Locator_ToBeHidden',
        toBeEnabled: '_CDP_Expect_Locator_ToBeEnabled',
        toBeDisabled: '_CDP_Expect_Locator_ToBeDisabled',
        toBeChecked: '_CDP_Expect_Locator_ToBeChecked',
        toHaveText: '_CDP_Expect_Locator_ToHaveText',
        toContainText: '_CDP_Expect_Locator_ToContainText',
        toHaveAttribute: '_CDP_Expect_Locator_ToHaveAttribute',

        toBe: '_CDP_Expect_Value_ToBe',
        toBeGreaterThan: '_CDP_Expect_Value_ToBeGreaterThan',
        toBeGreaterThanOrEqual: '_CDP_Expect_Value_ToBeGreaterThanOrEqual',
        toBeLessThan: '_CDP_Expect_Value_ToBeLessThan',
        toBeLessThanOrEqual: '_CDP_Expect_Value_ToBeLessThanOrEqual',
        toBeCloseTo: '_CDP_Expect_Value_ToBeCloseTo',
        toContain: '_CDP_Expect_Value_ToContain',
        toMatch: '_CDP_Expect_Value_ToMatch',
        toBeTruthy: '_CDP_Expect_Value_ToBeTruthy',
        toBeFalsy: '_CDP_Expect_Value_ToBeFalsy',
        toBeNull: '_CDP_Expect_Value_ToBeNull',
        toBeDefined: '_CDP_Expect_Value_ToBeDefined',
        toBeUndefined: '_CDP_Expect_Value_ToBeUndefined',
        toHaveLength: '_CDP_Expect_Value_ToHaveLength',

      };

      // Rewrite method names to UDF names
      let funcName = caller.func;
      if (cdpMethodMap[funcName]) {
        funcName = cdpMethodMap[funcName];
      }

      const matchedSignature = allSignatures[funcName];
      if (!matchedSignature) return null;


      const result = new SignatureHelp();
      result.signatures = [createSignatureInfo(matchedSignature)];
      result.activeSignature = 0;
      result.activeParameter = caller.commas;
      return result;
    },
  },
  '(',
  ',',
);
