import "zone.js";
import "zone.js/testing";
import "@testing-library/jest-dom";

import { getTestBed } from "@angular/core/testing";
import { BrowserTestingModule, platformBrowserTesting } from "@angular/platform-browser/testing";

getTestBed().initTestEnvironment(BrowserTestingModule, platformBrowserTesting(), {
  teardown: { destroyAfterEach: true },
  errorOnUnknownElements: true,
  errorOnUnknownProperties: true,
});
