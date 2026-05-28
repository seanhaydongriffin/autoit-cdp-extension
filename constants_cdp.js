import { CompletionItemKind } from 'vscode';
import { fillCompletions } from '../util';

const items = [


{
    label: 'launch',
    type: 'cdp_browser',
    detail: 'Browser.launch ( $sBrowser = Default, $iPort = Default, $aSwitches = Default, $sProfile = Default, $sWindowSize = Default, $bClearCookies = False )',
    documentation:
      '**Launches a new browser instance.**\n\n' +
      '- `$sBrowser`: the path to chrome.exe or a browser specifier (defaults to @ProgramFilesDir & "\\Google\\Chrome\\Application\\chrome.exe")\n' +
      '- `$iPort`: debugging port (defaults to 9222)\n' +
      '- `$aSwitches`: optional string of browser startup switches (defaults to a safe set of switches)\n' +
      '- `$sProfile`: user profile directory (defaults to @ScriptDir & "\\chromeprofile")\n' +
      '- `$sWindowSize`: ie. "1280,800" (default to the browser current size)\n' +
      '- `$bClearCookies`: True/False (defaults to False)\n\n' +
      'Returns: **Browser object**',
    insertText: 'launch',
  },

  {
    label: 'exists',
    type: 'cdp_browser',
    detail: 'Browser.exists ( $iPort )',
    documentation:
      '**Checks whether a browser instance is running on the given port.**\n\n' +
      'Returns: **True/False**',
    insertText: 'exists',
  },

  {
    label: 'isRunning',
    type: 'cdp_browser',
    detail: 'Browser.isRunning($port)',
    documentation:
      '**Returns True if a browser instance is running on the given port.**',
    insertText: 'isRunning',
  },

  {
    label: 'forceClose',
    type: 'cdp_browser',
    detail: 'Browser.forceClose($port)',
    documentation:
      '**Forcefully closes the browser instance running on the given port.**',
    insertText: 'forceClose',
  },  



  {
    label: 'newPage',
    type: 'cdp_chrome',
    detail: 'Browser.newPage()',
    documentation:
      '**Creates a new Page object.**\n\n' +
      'Equivalent to `_CDP_Browser_NewPage($oSelf)`.\n\n' +
      'Returns: **Page object**',
    insertText: 'newPage',
  },

  {
    label: 'getNewPage',
    type: 'cdp_chrome',
    detail: 'Browser.getNewPage()',
    documentation:
      '**Returns the next available Page object.**\n\n' +
      'Equivalent to `_CDP_Browser_GetNewPage($oSelf)`.\n\n' +
      'Returns: **Page object**',
    insertText: 'getNewPage',
  },

  {
    label: 'close',
    type: 'cdp_chrome',
    detail: 'Browser.close()',
    documentation:
      '**Closes the browser instance.**\n\n' +
      'Equivalent to `_CDP_Browser_Close($oSelf)`.',
    insertText: 'close',
  },



  {
    label: 'goto',
    type: 'cdp_page',
    documentation:
      '**Navigates the page to the specified URL.**\n\n' +
      'Equivalent to `_CDP_Page_Goto($oSelf, $url, $waitForLoad)`.\n\n' +
      'Returns: **the same page object**',
    detail: 'Page.goto($sUrl, $bWaitForLoad = True)',
    insertText: 'goto',
  },
  {
    label: 'locator',
    type: 'cdp_page',
    documentation:
      '**Creates a Locator object for the given selector.**\n\n' +
      'Equivalent to `_CDP_Page_Locator($oSelf, $selector)`.\n\n' +
      'Returns: **Locator object**',
    detail: 'Page.locator($sSelector)',
    insertText: 'locator',
  },

// Chainable
  { label: 'click', type: 'cdp_locator', detail: 'Locator.click(waitForLoad)', documentation: 'Clicks the element.', insertText: 'click' },
  { label: 'hover', type: 'cdp_locator', detail: 'Locator.hover()', documentation: 'Hovers over the element.', insertText: 'hover' },
  { label: 'fill', type: 'cdp_locator', detail: 'Locator.fill(value)', documentation: 'Fills an input element.', insertText: 'fill' },
  { label: 'scrollIntoView', type: 'cdp_locator', detail: 'Locator.scrollIntoView()', documentation: 'Scrolls the element into view.', insertText: 'scrollIntoView' },

  // Getters
  { label: 'textContent', type: 'cdp_locator', detail: 'Locator.textContent()', documentation: 'Returns textContent.', insertText: 'textContent' },
  { label: 'innerText', type: 'cdp_locator', detail: 'Locator.innerText()', documentation: 'Returns innerText.', insertText: 'innerText' },
  { label: 'innerTextCRStripped', type: 'cdp_locator', detail: 'Locator.innerTextCRStripped()', documentation: 'Returns innerText with CR removed.', insertText: 'innerTextCRStripped' },
  { label: 'innerTextLFStripped', type: 'cdp_locator', detail: 'Locator.innerTextLFStripped()', documentation: 'Returns innerText with LF removed.', insertText: 'innerTextLFStripped' },
  { label: 'innerTextReplace', type: 'cdp_locator', detail: 'Locator.innerTextReplace(find, replace)', documentation: 'Replaces text.', insertText: 'innerTextReplace' },
  { label: 'innerHTML', type: 'cdp_locator', detail: 'Locator.innerHTML()', documentation: 'Returns innerHTML.', insertText: 'innerHTML' },
  { label: 'inputValue', type: 'cdp_locator', detail: 'Locator.inputValue()', documentation: 'Returns input value.', insertText: 'inputValue' },
  { label: 'getAttribute', type: 'cdp_locator', detail: 'Locator.getAttribute(name)', documentation: 'Returns attribute value.', insertText: 'getAttribute' },
  { label: 'isVisible', type: 'cdp_locator', detail: 'Locator.isVisible()', documentation: 'Returns True/False.', insertText: 'isVisible' },
  { label: 'isHidden', type: 'cdp_locator', detail: 'Locator.isHidden()', documentation: 'Returns True/False.', insertText: 'isHidden' },
  { label: 'isEnabled', type: 'cdp_locator', detail: 'Locator.isEnabled()', documentation: 'Returns True/False.', insertText: 'isEnabled' },
  { label: 'isDisabled', type: 'cdp_locator', detail: 'Locator.isDisabled()', documentation: 'Returns True/False.', insertText: 'isDisabled' },
  { label: 'isEditable', type: 'cdp_locator', detail: 'Locator.isEditable()', documentation: 'Returns True/False.', insertText: 'isEditable' },
  { label: 'isChecked', type: 'cdp_locator', detail: 'Locator.isChecked()', documentation: 'Returns True/False.', insertText: 'isChecked' },


  {
    label: 'expect',
    type: 'cdp_expect_root',
    detail: 'teststep.expect(value)',
    documentation: '**Creates an Expect object for assertions.**',
    insertText: 'expect'
  },

  { label: 'toBeVisible', type: 'cdp_expect', detail: 'toBeVisible(expected, lineNumber)', documentation: 'Asserts that the locator has the expected text.', insertText: 'toBeVisible' },
  { label: 'toBeEnabled', type: 'cdp_expect', detail: 'toBeEnabled(expected, lineNumber)', documentation: 'Asserts that the locator has the expected text.', insertText: 'toBeEnabled' },
  { label: 'toBeDisabled', type: 'cdp_expect', detail: 'toBeDisabled(expected, lineNumber)', documentation: 'Asserts that the locator has the expected text.', insertText: 'toBeDisabled' },
  { label: 'toBeChecked', type: 'cdp_expect', detail: 'toBeChecked(expected, lineNumber)', documentation: 'Asserts that the locator has the expected text.', insertText: 'toBeChecked' },
  { label: 'toHaveText', type: 'cdp_expect', detail: 'toHaveText(expected, lineNumber)', documentation: 'Asserts that the locator has the expected text.', insertText: 'toHaveText' },
  { label: 'toContainText', type: 'cdp_expect', detail: 'toContainText(expected, lineNumber)', documentation: 'Asserts that the locator has the expected text.', insertText: 'toContainText' },
  { label: 'toHaveAttribute', type: 'cdp_expect', detail: 'toHaveAttribute(expected, lineNumber)', documentation: 'Asserts that the locator has the expected text.', insertText: 'toHaveAttribute' },
  //{ label: 'toHaveClass', type: 'cdp_expect', detail: 'toHaveClass(expected, lineNumber)', documentation: 'Asserts that the locator has the expected text.', insertText: 'toHaveClass' },
  //{ label: 'toHaveCount', type: 'cdp_expect', detail: 'toHaveCount(expected, lineNumber)', documentation: 'Asserts that the locator has the expected text.', insertText: 'toHaveCount' },
  //{ label: 'toHaveValue', type: 'cdp_expect', detail: 'toHaveValue(expected, lineNumber)', documentation: 'Asserts that the locator has the expected text.', insertText: 'toHaveValue' },
  //{ label: 'toHaveJSProperty', type: 'cdp_expect', detail: 'toHaveJSProperty(expected, lineNumber)', documentation: 'Asserts that the locator has the expected text.', insertText: 'toHaveJSProperty' },
  { label: 'toBe', type: 'cdp_expect', detail: 'toBe(expected, lineNumber)', documentation: 'Asserts that the locator has the expected text.', insertText: 'toBe' },
  { label: 'toBeGreaterThan', type: 'cdp_expect', detail: 'toBeGreaterThan(expected, lineNumber)', documentation: 'Asserts that the locator has the expected text.', insertText: 'toBeGreaterThan' },
  { label: 'toBeLessThan', type: 'cdp_expect', detail: 'toBeLessThan(expected, lineNumber)', documentation: 'Asserts that the locator has the expected text.', insertText: 'toBeLessThan' },
  { label: 'toBeLessThanOrEqual', type: 'cdp_expect', detail: 'toBeLessThanOrEqual(expected, lineNumber)', documentation: 'Asserts that the locator has the expected text.', insertText: 'toBeLessThanOrEqual' },
  { label: 'toBeCloseTo', type: 'cdp_expect', detail: 'toBeCloseTo(expected, lineNumber)', documentation: 'Asserts that the locator has the expected text.', insertText: 'toBeCloseTo' },
  { label: 'toContain', type: 'cdp_expect', detail: 'toContain(expected, lineNumber)', documentation: 'Asserts that the locator has the expected text.', insertText: 'toContain' },
  { label: 'toMatch', type: 'cdp_expect', detail: 'toMatch(expected, lineNumber)', documentation: 'Asserts that the locator has the expected text.', insertText: 'toMatch' },
  { label: 'toBeTruthy', type: 'cdp_expect', detail: 'toBeTruthy(expected, lineNumber)', documentation: 'Asserts that the locator has the expected text.', insertText: 'toBeTruthy' },
  { label: 'toBeFalsy', type: 'cdp_expect', detail: 'toBeFalsy(expected, lineNumber)', documentation: 'Asserts that the locator has the expected text.', insertText: 'toBeFalsy' },
  { label: 'toBeNull', type: 'cdp_expect', detail: 'toBeNull(expected, lineNumber)', documentation: 'Asserts that the locator has the expected text.', insertText: 'toBeNull' },
  { label: 'toBeDefined', type: 'cdp_expect', detail: 'toBeDefined(expected, lineNumber)', documentation: 'Asserts that the locator has the expected text.', insertText: 'toBeDefined' },
  { label: 'toBeUndefined', type: 'cdp_expect', detail: 'toBeUndefined(expected, lineNumber)', documentation: 'Asserts that the locator has the expected text.', insertText: 'toBeUndefined' },
  { label: 'toHaveLength', type: 'cdp_expect', detail: 'toHaveLength(expected, lineNumber)', documentation: 'Asserts that the locator has the expected text.', insertText: 'toHaveLength' },



];

export default fillCompletions(items, CompletionItemKind.Method, '', 'CDP.au3');
