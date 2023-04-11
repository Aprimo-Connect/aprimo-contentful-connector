import { selectorOptions } from "./config";
import {
  contentSelectorPostMessageCallbackHandlerBuilder,
  getAprimoContentSelectorUrl,
  getAprimoDamOrigin,
} from "./util";

let contentSelectorWindowReference;

function isContentSelectorAlreadyOpen() {
  if (
    contentSelectorWindowReference &&
    !contentSelectorWindowReference.closed
  ) {
    return true;
  }

  return false;
}

function openContentSelector(aprimoDamOrigin, selectorOptions, sdk) {
  const aprimoContentSelectorUrl = getAprimoContentSelectorUrl(
    aprimoDamOrigin,
    selectorOptions,
    sdk
  );

  return new Promise((resolve) => {
    const params = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,width=1000,height=600,left=100,top=100`;
    contentSelectorWindowReference = window.open(
      aprimoContentSelectorUrl.toString(),
      "selector",
      params
    );
    window.addEventListener(
      "message",
      contentSelectorPostMessageCallbackHandlerBuilder(
        aprimoDamOrigin,
        (selection) => resolve(selection)
      )
    );
  });
}

export function renderDialog() {}

export async function openDialog(sdk, _, config) {
  if (isContentSelectorAlreadyOpen()) {
    contentSelectorWindowReference.focus();
    return [];
  }

  const aprimoDamOrigin = getAprimoDamOrigin(config);

  const result = await openContentSelector(
    aprimoDamOrigin,
    selectorOptions,
    sdk
  );

  if (!Array.isArray(result)) {
    return [];
  }

  return result;
}
