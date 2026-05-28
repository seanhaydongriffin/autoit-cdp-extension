import { CompletionItemKind } from 'vscode';
import { signatureToCompletion, signatureToHover } from '../util';

const include = '(Requires: `#include <CDP.au3>`)';

const signatures = {


    _CDP_Browser_Launch: {
        documentation:
            '**Launches a new browser instance.**\n\n' +
            '- `$sBrowser`: (optional) browser path or specifier\n' +
            '- `$iPort`: (optional) debugging port\n' +
            '- `$aSwitches`: (optional) browser startup switches\n' +
            '- `$sProfile`: (optional) user profile directory\n' +
            '- `$sWindowSize`: (optional) browser size\n' +
            '- `$bClearCookies`: (optional) clear the browsers cookies\n\n' +
            'Returns: **Browser object**',
        label: 'launch ( $sBrowser = Default, $iPort = Default, $aSwitches = Default, $sProfile = Default, $sWindowSize = Default, $bClearCookies = False )',
        params: [
            { label: '$sBrowser', documentation: 'The path to chrome.exe or a browser specifier (defaults to @ProgramFilesDir & "\\Google\\Chrome\\Application\\chrome.exe")' },
            { label: '$iPort', documentation: 'The debugging port (defaults to 9222).' },
            { label: '$aSwitches', documentation: 'A string of browser startup switches (defaults to a safe set of switches).' },
            { label: '$sProfile', documentation: 'The user profile directory (defaults to @ScriptDir & "\\chromeprofile").' },
            { label: '$sWindowSize', documentation: 'The window size, e.g. "1280,800" (default to the browser current size).' },
            { label: '$bClearCookies', documentation: 'True/False (defaults to False).' },
        ],
    },

    _CDP_Browser_Exists: {
        documentation:
            '**Returns if a browser instance is running on a given $iPort.**\n\n' +
            'Returns: **True/False**',
        label: 'exists ( $iPort )',
        params: [
            { label: '$iPort', documentation: 'The debugging port number.' },
        ],
    },

    _CDP_Browser_IsRunning: {
        documentation:
            '**Returns if a browser instance is running on a given $iPort.**',
        label: 'isRunning ( $iPort )',
        params: [
            { label: '$iPort', documentation: 'The debugging port number.' },
        ],
    },

    _CDP_Browser_ForceClose: {
        documentation:
            '**Forcefully closes the browser instance running on the given $iPort.**',
        label: 'forceClose ( $iPort )',
        params: [
            { label: '$iPort', documentation: 'The debugging port number.' },
        ],
    },



    _CDP_Browser_NewPage: {
        documentation:
            '**Creates a new Page object.**\n\n' +
            'Returns: **Page object**',
        label: 'newPage ( )',
    },

    _CDP_Browser_GetNewPage: {
        documentation:
            '**Returns the next available Page object.**\n\n' +
            'Returns: **Page object**',
        label: 'getNewPage ( )',
    },

    _CDP_Browser_Close: {
        documentation:
            '**Closes the browser instance.**',
        label: 'close ( )',
    },





    _CDP_Page_Goto: {
        documentation:
            '**Navigates the page to the specified URL.**\n\n' +
            'Returns **the same page object**.',
        label: 'goto ( $sUrl, $bWaitForLoad = True )',
        params: [
            { label: '$sUrl', documentation: 'The URL to navigate to.'},
            { label: '$bWaitForLoad', documentation: 'Wait for the page to finish loading? (True/False).' },
        ],
    },

    _CDP_Page_Locator: {
        documentation: 
            '**Locators an object / elements for the given selector.**\n\n' +
            'Returns **a locator object**.',
        label: 'locator ( $sSelector )',
        params: [
            { label: '$oPage', documentation: 'The Page object.' },
            { label: '$sSelector', documentation: 'CSS selector for the locator.' },
        ],
    },


    _CDP_Locator_Click: {
        documentation: 'Clicks this object / element.',
        label: 'click ( $bWaitForLoad = False )',
        params: [
            { label: '$bWaitForLoad', documentation: 'Wait for page load after click (True/False).' },
        ],
    },

    _CDP_Locator_Hover: {
        documentation: 'Hovers over this object / element.',
        label: 'hover ( )',
    },

    _CDP_Locator_Fill: {
        documentation: 'Enters text into this object / element.',
        label: 'fill ( $value )',
        params: [
            { label: '$value', documentation: 'The value to enter.' },
        ],
    },

    _CDP_Locator_ScrollIntoView: {
        documentation: 'Scrolls this object / element into view.',
        label: 'scrollIntoView ( )',
    },

    _CDP_Locator_TextContent: {
        documentation: 'Returns the text content of this object / element.',
        label: 'textContent ( )',
    },

    _CDP_Locator_InnerText: {
        documentation: 'Returns the InnerText of this object / element.',
        label: 'innerText ( )',
    },

    _CDP_Locator_InnerTextCRStripped: {
        documentation: 'Returns the InnerText of this object / element with carriage returns removed.',
        label: 'innerTextCRStripped ( )',
    },

    _CDP_Locator_InnerTextLFStripped: {
        documentation: 'Returns the InnerText of this object / element with linefeeds removed.',
        label: 'innerTextLFStripped ( )',
    },

    _CDP_Locator_InnerTextReplace: {
        documentation: 'Returns the InnerText of this object / element with replacements.',
        label: 'innerTextReplace ( $sSearchString, $sReplaceString )',
        params: [
            { label: '$sSearchString', documentation: 'The string to find.' },
            { label: '$sReplaceString', documentation: 'The string to replace.' },
        ],
    },

    _CDP_Locator_InnerHTML: {
        documentation: 'Returns the InnerHTML of this object / element.',
        label: 'innerHTML ( )',
    },

    _CDP_Locator_InputValue: {
        documentation: 'Returns the InputValue of this object / element.',
        label: 'inputValue ( )',
    },

    _CDP_Locator_GetAttribute: {
        documentation: 'Gets the value of $sAttribute for this object / element.',
        label: 'getAttribute ( $sAttribute )',
        params: [
            { label: '$sAttribute', documentation: 'The attribute name.' },
        ],
    },

    _CDP_Locator_IsVisible: {
        documentation: 'Returns if this object / element is visible.',
        label: 'isVisible ( )',
    },

    _CDP_Locator_IsHidden: {
        documentation: 'Returns if this object / element is hidden.',
        label: 'isHidden ( )',
    },

    _CDP_Locator_IsEnabled: {
        documentation: 'Returns if this object / element is enabled.',
        label: 'isEnabled ( )',
    },

    _CDP_Locator_IsDisabled: {
        documentation: 'Returns if this object / element is disabled.',
        label: 'isDisabled ( )',
    },

    _CDP_Locator_IsEditable: {
        documentation: 'Returns if this object / element is editable.',
        label: 'isEditable ( )',
    },

    _CDP_Locator_IsChecked: {
        documentation: 'Returns if this object / element is checked.',
        label: 'isChecked ( )',
    },

    _CDP_Test_Step_Expect: {
        documentation: 'Assert against $something.',
        label: 'expect ( $something )',
        params: [
            { label: '$something', documentation: 'The locator object or primitive value to assert.' },
        ],
    },

    _CDP_Expect_Locator_ToBeVisible: {
        documentation: 'Expect this object / element to be visible.',
        label: 'toBeVisible ( $scriptLineNumber = "" )',
        params: [
            { label: '$scriptLineNumber', documentation: 'The line number of the script (optional).' },
        ],
    },

    _CDP_Expect_Locator_ToBeHidden: {
        documentation: 'Expect this object / element to be hidden.',
        label: 'toBeHidden ( $scriptLineNumber = "" )',
        params: [
            { label: '$scriptLineNumber', documentation: 'The line number of the script (optional).' },
        ],
    },

    _CDP_Expect_Locator_ToBeEnabled: {
        documentation: 'Expect this object / element to be enabled.',
        label: 'toBeEnabled ( $scriptLineNumber = "" )',
        params: [
            { label: '$scriptLineNumber', documentation: 'The line number of the script (optional).' },
        ],
    },

    _CDP_Expect_Locator_ToBeDisabled: {
        documentation: 'Expect this object / element to be disabled.',
        label: 'toBeDisabled ( $scriptLineNumber = "" )',
        params: [
            { label: '$scriptLineNumber', documentation: 'The line number of the script (optional).' },
        ],
    },

    _CDP_Expect_Locator_ToBeChecked: {
        documentation: 'Expect this object / element to be checked.',
        label: 'toBeChecked ( $scriptLineNumber = "" )',
        params: [
            { label: '$scriptLineNumber', documentation: 'The line number of the script (optional).' },
        ],
    },

    _CDP_Expect_Locator_ToHaveText: {
        documentation: 'Expect this object / element to have $text.',
        label: 'toHaveText ( $text, $scriptLineNumber = "" )',
        params: [
            { label: '$text', documentation: 'The expected text.' },
            { label: '$scriptLineNumber', documentation: 'The line number of the script (optional).' },
        ],
    },

    _CDP_Expect_Locator_ToContainText: {
        documentation: 'Expect this object / element to contain $text.',
        label: 'toContainText ( $text, $scriptLineNumber = "" )',
        params: [
            { label: '$text', documentation: 'The expected text.' },
            { label: '$scriptLineNumber', documentation: 'The line number of the script (optional).' },
        ],
    },

    _CDP_Expect_Locator_ToHaveAttribute: {
        documentation: 'Expect this object / element to have an attribute of $name and $value.',
        label: 'toHaveAttribute ( $name, $value, $scriptLineNumber = "" )',
        params: [
            { label: '$name', documentation: 'The name of the attribute.' },
            { label: '$value', documentation: 'The expected value of the attribute.' },
            { label: '$scriptLineNumber', documentation: 'The line number of the script (optional).' },
        ],
    },

    _CDP_Expect_Locator_ToHaveValue: {
        documentation: 'Expect this object / element to have the value of $value.',
        label: 'toHaveValue ( $value, $scriptLineNumber = "" )',
        params: [
            { label: '$value', documentation: 'The expected value.' },
            { label: '$scriptLineNumber', documentation: 'The line number of the script (optional).' },
        ],
    },

    _CDP_Expect_Locator_ToBe: {
        documentation: 'Expect this object / element to be the same as $variable.',
        label: 'toBe ( $variable, $scriptLineNumber = "" )',
        params: [
            { label: '$variable', documentation: 'An AutoIt variable to compare against.' },
            { label: '$scriptLineNumber', documentation: 'The line number of the script (optional).' },
        ],
    },

    _CDP_Expect_Locator_ToBeGreaterThan: {
        documentation: 'Expect this object / element to be greater than $number.',
        label: 'toBeGreaterThan ( $number, $scriptLineNumber = "" )',
        params: [
            { label: '$number', documentation: 'A number to compare against.' },
            { label: '$scriptLineNumber', documentation: 'The line number of the script (optional).' },
        ],
    },

    _CDP_Expect_Locator_ToBeGreaterThanOrEqual: {
        documentation: 'Expect this object / element to be greater than or equal to $number.',
        label: 'toBeGreaterThanOrEqual ( $number, $scriptLineNumber = "" )',
        params: [
            { label: '$number', documentation: 'A number to compare against.' },
            { label: '$scriptLineNumber', documentation: 'The line number of the script (optional).' },
        ],
    },

    _CDP_Expect_Locator_ToBeLessThan: {
        documentation: 'Expect this object / element to be less than $number.',
        label: 'toBeLessThan ( $number, $scriptLineNumber = "" )',
        params: [
            { label: '$number', documentation: 'A number to compare against.' },
            { label: '$scriptLineNumber', documentation: 'The line number of the script (optional).' },
        ],
    },

    _CDP_Expect_Locator_ToBeLessThanOrEqual: {
        documentation: 'Expect this object / element to be less than or equal to $number.',
        label: 'toBeLessThanOrEqual ( $number, $scriptLineNumber = "" )',
        params: [
            { label: '$number', documentation: 'A number to compare against.' },
            { label: '$scriptLineNumber', documentation: 'The line number of the script (optional).' },
        ],
    },

    _CDP_Expect_Locator_ToBeCloseTo: {
        documentation: 'Expect this object / element to be close to $number.',
        label: 'toBeCloseTo ( $number, $precision = 2, $scriptLineNumber = "" )',
        params: [
            { label: '$number', documentation: 'A number to compare against.' },
            { label: '$precision', documentation: 'The precision to compare with.' },
            { label: '$scriptLineNumber', documentation: 'The line number of the script (optional).' },
        ],
    },

    _CDP_Expect_Locator_ToContain: {
        documentation: 'Expect this object / element to contain $variable.',
        label: 'toContain ( $variable, $scriptLineNumber = "" )',
        params: [
            { label: '$variable', documentation: 'An AutoIt variable to compare against.' },
            { label: '$scriptLineNumber', documentation: 'The line number of the script (optional).' },
        ],
    },

    _CDP_Expect_Locator_ToMatch: {
        documentation: 'Expect this object / element to match this $pattern.',
        label: 'toMatch ( $pattern, $scriptLineNumber = "" )',
        params: [
            { label: '$pattern', documentation: 'A regular expression patter to match.' },
            { label: '$scriptLineNumber', documentation: 'The line number of the script (optional).' },
        ],
    },

    _CDP_Expect_Locator_ToBeTruthy: {
        documentation: 'Expect this object / element to be True.',
        label: 'toBeTruthy ( $scriptLineNumber = "" )',
        params: [
            { label: '$scriptLineNumber', documentation: 'The line number of the script (optional).' },
        ],
    },

    _CDP_Expect_Locator_ToBeFalsy: {
        documentation: 'Expect this object / element to be False.',
        label: 'toBeFalsy ( $scriptLineNumber = "" )',
        params: [
            { label: '$scriptLineNumber', documentation: 'The line number of the script (optional).' },
        ],
    },

    _CDP_Expect_Locator_ToBeNull: {
        documentation: 'Expect this object / element to be Null.',
        label: 'toBeNull ( $scriptLineNumber = "" )',
        params: [
            { label: '$scriptLineNumber', documentation: 'The line number of the script (optional).' },
        ],
    },

    _CDP_Expect_Locator_ToBeDefined: {
        documentation: 'Expect this object / element to be defined.',
        label: 'toBeDefined ( $scriptLineNumber = "" )',
        params: [
            { label: '$scriptLineNumber', documentation: 'The line number of the script (optional).' },
        ],
    },

    _CDP_Expect_Locator_ToBeUndefined: {
        documentation: 'Expect this object / element to be undefined.',
        label: 'ToBeUndefined ( $scriptLineNumber = "" )',
        params: [
            { label: '$scriptLineNumber', documentation: 'The line number of the script (optional).' },
        ],
    },

    _CDP_Expect_Locator_ToHaveLength: {
        documentation: 'Expect this object / element to have a length of $length.',
        label: 'toHaveLength ( $length, $scriptLineNumber = "" )',
        params: [
            { label: '$length', documentation: 'The expected length (in bytes).' },
            { label: '$scriptLineNumber', documentation: 'The line number of the script (optional).' },
        ],
    },




};

const hovers = signatureToHover(signatures);
const completions = signatureToCompletion(signatures, CompletionItemKind.Function, include);

export { signatures as default, hovers, completions };
